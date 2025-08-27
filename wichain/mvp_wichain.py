import pandas as pd
import numpy as np
import json
import hashlib
import time
from datetime import datetime
import pickle
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')
import json, os
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.utils.data_loader import DataLoader
from backend.utils.feature_extractor import FeatureExtractor
from backend.models import WiFiNetwork, Block, SessionLocal, BlockchainSessionLocal
from config import MODEL_PARAMS, MODEL_PATH

class WiChainDetector:
    def __init__(self):
        self.model = None
        self.feature_extractor = FeatureExtractor()
        self.rules = {
            'min_signal_strength': -85,
            'max_signal_variance': 10,
            'common_rogue_ssids': ['Free WiFi', 'Public WiFi', 'Airport WiFi', 'Hotel Guest']
        }
        self.load_oui()
        self.OUI_DATA = {}

    # Load OUI JSON
    def load_oui(self):
        """Load OUI database for vendor lookup"""
        path = os.path.join(os.path.dirname(__file__), "data", "oui.json")
        try:
            with open(path, "r") as f:
                self.OUI_DATA = json.load(f)
            print(f"✅ Loaded {len(self.OUI_DATA)} OUIs")
        except FileNotFoundError:
            print(f"⚠️ OUI file not found at {path}")
            # Try alternative path
            alt_path = r"C:\\Users\\Afraa\\Downloads\\wichain\\oui.json"
            try:
                with open(alt_path, "r") as f:
                    self.OUI_DATA = json.load(f)
                print(f"✅ Loaded {len(self.OUI_DATA)} OUIs from alternative path")
            except Exception as e:
                print(f"⚠️ Failed to load OUI data from alternative path: {e}")
                self.OUI_DATA = {}
        except Exception as e:
            print(f"⚠️ Failed to load OUI data: {e}")
            self.OUI_DATA = {}

    def load_real_data(self, file_path):
        """Load real-world Wi-Fi data"""
        loader = DataLoader()
        return loader.load_data(file_path)
    
    def train_model(self, df):
        """Train advanced ML model with real data"""
        # FIX: Ensure target variable is properly formatted as integer
        df = df.copy()
        df['is_spoof'] = df['is_spoof'].astype(int)
        
        # Extract features
        X = self.feature_extractor.prepare_training_data(df)
        y = df['is_spoof']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Train multiple models and select best
        models = {
            'RandomForest': RandomForestClassifier(**MODEL_PARAMS),
            'GradientBoosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
        }
        
        best_model = None
        best_score = 0
        
        for name, model in models.items():
            # Cross-validation
            scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1_weighted')
            mean_score = np.mean(scores)
            
            print(f"{name} CV F1 Score: {mean_score:.3f}")
            
            if mean_score > best_score:
                best_score = mean_score
                best_model = model
        
        # Train best model
        best_model.fit(X_train, y_train)
        self.model = best_model
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nBest Model: {type(best_model).__name__}")
        print(f"Test Accuracy: {accuracy:.3f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        print("\nConfusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
        
        # Save model
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(self.model, f)
        
        return accuracy
    
    def load_model(self):
        """Load the trained model"""
        try:
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            return True
        except FileNotFoundError:
            print("Model not found. Please train the model first.")
            return False
    
    def predict(self, network_data):
        """Predict if a network is spoofed"""
        if not self.model:
            if not self.load_model():
                return None
        
        try:
            # Extract features
            features = self.feature_extractor.transform(network_data)
            
            # Predict
            prediction = self.model.predict(features)
            probability = self.model.predict_proba(features)
            
            return prediction, probability
        except Exception as e:
            print(f"Prediction error: {e}")
            # Return default prediction
            return np.array([0]), np.array([[0.7, 0.3]])  # Default: legitimate with 70% confidence
    
    def detect_spoofing(self, network_data):
        """Comprehensive spoofing detection"""
        # Ensure data types are consistent
        network_data = network_data.copy()
        if 'is_spoof' in network_data and isinstance(network_data['is_spoof'], str):
            network_data['is_spoof'] = int(network_data['is_spoof'])
        
        # Rule-based detection
        rule_reasons = self.rule_based_detection(network_data)
        
        # ML-based detection with error handling
        try:
            prediction, probability = self.predict(network_data)
            ml_confidence = probability[0][1] if prediction[0] == 1 else probability[0][0]
            ml_prediction = int(prediction[0])
        except Exception as e:
            print(f"ML detection failed: {e}")
            ml_confidence = 0.5  # Neutral confidence
            ml_prediction = 0    # Default to legitimate
        
        # Combine detection methods
        is_spoof, confidence = self.combine_detection(rule_reasons, ml_prediction, ml_confidence)
        
        result = {
            'ssid': network_data.get('ssid', ''),
            'bssid': network_data.get('bssid', ''),
            'is_spoof': bool(is_spoof),
            'vendor': network_data.get('vendor', 'Unknown'),
            'ml_confidence': float(ml_confidence),
            'ml_prediction': ml_prediction,
            'timestamp': datetime.now().isoformat(),
            'features': self.feature_extractor.extract_features(network_data),
            'reasons': rule_reasons
        }
        
        # Save to database
        self.save_to_database(network_data, result)
        
        # Log to blockchain if spoofed
        if is_spoof:
            self.add_to_blockchain(result)
            # print(f"  Spoof network detected: {network_data.get('ssid', 'Unknown')}")
            # print(f"   Reasons: {rule_reasons}")
            # print(f"   Vendor: {network_data.get('vendor', 'Unknown')}")  
            # print(f"   ML Confidence: {ml_confidence:.2f}")
        else:
            print(f"Legitimate network: {network_data.get('ssid', 'Unknown')}")
        
        return result
    
    def combine_detection(self, rule_reasons, ml_prediction, ml_confidence):
        """
        Decide spoofing based on rule-based + ML confidence.
        """
        score = 0
        
        # Rule-based weights
        score += len(rule_reasons)          # 1 point per triggered rule
        if ml_prediction == 1:
            score += 2 if ml_confidence > 0.8 else 1  # ML vote weighted

        # Final decision
        if score >= 4:
            return True, ml_confidence
        elif score >= 2:
            return False, ml_confidence  # Suspicious but not confirmed
        else:
            return False, ml_confidence
        
    def save_to_database(self, network_data, result):
        """Save network data to SQL database"""
        session = SessionLocal()
        try:
            network = WiFiNetwork(
                ssid=network_data.get('ssid', ''),
                bssid=network_data.get('bssid', ''),
                signal_strength=network_data.get('signal_strength', -100),
                frequency=network_data.get('frequency', 2.4),
                channel=network_data.get('channel', 1),
                encryption=network_data.get('encryption', 'UNKNOWN'),
                latitude=network_data.get('latitude', 0.0),
                longitude=network_data.get('longitude', 0.0),
                is_spoof=result['is_spoof'],
                features=result['features']
            )
            session.add(network)
            session.commit()
        except Exception as e:
            print(f"Database error: {e}")
            session.rollback()
        finally:
            session.close()
    
    def add_to_blockchain(self, data):
        """Add detection result to blockchain"""
        session = BlockchainSessionLocal()
        try:
            # Get previous block
            prev_block = session.query(Block).order_by(Block.index.desc()).first()
            prev_hash = prev_block.hash if prev_block else "0"
            index = prev_block.index + 1 if prev_block else 0
            
            # Create new block
            timestamp = datetime.utcnow()
            block_hash = self.calculate_hash(index, prev_hash, data, timestamp)
            
            block = Block(
                index=index,
                timestamp=timestamp,
                data=data,
                previous_hash=prev_hash,
                hash=block_hash
            )
            
            session.add(block)
            session.commit()
        except Exception as e:
            print(f"Blockchain error: {e}")
            session.rollback()
        finally:
            session.close()
    
    def calculate_hash(self, index, previous_hash, data, timestamp):
        """Calculate block hash"""
        value = f"{index}{previous_hash}{json.dumps(data, sort_keys=True)}{timestamp.isoformat()}".encode()
        return hashlib.sha256(value).hexdigest()
    
    def get_blockchain(self):
        """Retrieve entire blockchain"""
        session = BlockchainSessionLocal()
        try:
            blocks = session.query(Block).order_by(Block.index).all()
            return [block.to_dict() for block in blocks]
        finally:
            session.close()

    def rule_based_detection(self, network):
        """Enhanced rule-based detection"""
        reasons = []
        
        # Check signal strength
        if network.get('signal_strength') < self.rules['min_signal_strength']:
            reasons.append(f"Low signal strength: {network.get('signal_strength')}dBm")
        
        # Check for common rogue SSIDs
        ssid = network.get('ssid', '')
        if any(rogue in ssid for rogue in self.rules['common_rogue_ssids']):
            reasons.append(f"Suspicious SSID: {ssid}")
        
        # Check encryption
        encryption = network.get('encryption', 'OPEN').upper()
        if encryption in ['OPEN', 'WEP']:
            reasons.append(f"Insecure encryption: {encryption}")
        
        # Check vendor
        vendor = network.get('vendor', 'Unknown')
        if vendor in ['Unknown', 'Rogue', 'Generic']:
            reasons.append(f"vendor: {vendor}")
        
        # Check for hidden networks
        if not ssid or ssid.isspace():
            reasons.append("Hidden network (no SSID)")
        
        return reasons