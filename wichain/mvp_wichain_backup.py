# # wichain/mvp_wichain.py
# import pandas as pd
# import numpy as np
# import json
# import hashlib
# import time
# from datetime import datetime
# import pickle
# from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
# from sklearn.model_selection import train_test_split, cross_val_score
# from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
# from sklearn.preprocessing import StandardScaler
# import warnings
# warnings.filterwarnings('ignore')

# from utils.data_loader import DataLoader
# from utils.feature_extractor import FeatureExtractor
# from backend.models import WiFiNetwork, Block, SessionLocal, BlockchainSessionLocal
# from config import MODEL_PARAMS, MODEL_PATH

# class WiChainDetector:
#     def __init__(self):
#         self.model = None
#         self.feature_extractor = FeatureExtractor()
#         self.rules = {
#             'min_signal_strength': -85,
#             'max_signal_variance': 10,
#             'common_rogue_ssids': ['Free WiFi', 'Public WiFi', 'Airport WiFi', 'Hotel Guest']
#         }
        
#     def load_real_data(self, file_path):
#         """Load real-world Wi-Fi data"""
#         loader = DataLoader()
#         return loader.load_data(file_path)
    
#     def train_model(self, df):
#         """Train advanced ML model with real data"""
#         # Extract features
#         X = self.feature_extractor.prepare_training_data(df)
#         y = df['is_spoof']
        
#         # Split data
#         X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
#         # Train multiple models and select best
#         models = {
#             'RandomForest': RandomForestClassifier(**MODEL_PARAMS),
#             'GradientBoosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
#         }
        
#         best_model = None
#         best_score = 0
        
#         for name, model in models.items():
#             # Cross-validation
#             scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1_weighted')
#             mean_score = np.mean(scores)
            
#             print(f"{name} CV F1 Score: {mean_score:.3f}")
            
#             if mean_score > best_score:
#                 best_score = mean_score
#                 best_model = model
        
#         # Train best model
#         best_model.fit(X_train, y_train)
#         self.model = best_model
        
#         # Evaluate
#         y_pred = self.model.predict(X_test)
#         accuracy = accuracy_score(y_test, y_pred)
        
#         print(f"\nBest Model: {type(best_model).__name__}")
#         print(f"Test Accuracy: {accuracy:.3f}")
#         print("\nClassification Report:")
#         print(classification_report(y_test, y_pred))
#         print("\nConfusion Matrix:")
#         print(confusion_matrix(y_test, y_pred))
        
#         # Save model
#         with open(MODEL_PATH, 'wb') as f:
#             pickle.dump(self.model, f)
        
#         return accuracy
    
#     def load_model(self):
#         """Load the trained model"""
#         try:
#             with open(MODEL_PATH, 'rb') as f:
#                 self.model = pickle.load(f)
#             return True
#         except FileNotFoundError:
#             print("Model not found. Please train the model first.")
#             return False
    
#     def predict(self, network_data):
#         """Predict if a network is spoofed"""
#         if not self.model:
#             if not self.load_model():
#                 return None
        
#         # Extract features
#         features = self.feature_extractor.transform(network_data)
        
#         # Predict
#         prediction = self.model.predict(features)
#         probability = self.model.predict_proba(features)
        
#         return prediction, probability
    
#     def detect_spoofing(self, network_data):
#         """Comprehensive spoofing detection"""
#         # Rule-based detection
#         rule_reasons = self.rule_based_detection(network_data)
        
#         # ML-based detection
#         prediction, probability = self.predict(network_data)
#         ml_confidence = probability[0][1] if prediction[0] == 1 else probability[0][0]
        
#         # Combine results
#         is_spoof = len(rule_reasons) > 2 or (prediction[0] == 1 and ml_confidence > 0.7)
        
#         result = {
#             'ssid': network_data.get('ssid', ''),
#             'bssid': network_data.get('bssid', ''),
#             'is_spoof': bool(is_spoof),
#             'rule_based_reasons': rule_reasons,
#             'ml_confidence': float(ml_confidence),
#             'ml_prediction': int(prediction[0]),
#             'timestamp': datetime.now().isoformat(),
#             'features': self.feature_extractor.extract_features(network_data)
#         }
        
#         # Save to database
#         self.save_to_database(network_data, result)
        
#         # Log to blockchain if spoofed
#         if is_spoof:
#             self.add_to_blockchain(result)
#             print(f"  Spoof network detected: {network_data.get('ssid', 'Unknown')}")
#             print(f"   Reasons: {rule_reasons}")
#             print(f"   ML Confidence: {ml_confidence:.2f}")
#         else:
#             print(f"✅ Legitimate network: {network_data.get('ssid', 'Unknown')}")
        
#         return result
    
#     def save_to_database(self, network_data, result):
#         """Save network data to SQL database"""
#         session = SessionLocal()
#         try:
#             network = WiFiNetwork(
#                 ssid=network_data.get('ssid', ''),
#                 bssid=network_data.get('bssid', ''),
#                 signal_strength=network_data.get('signal_strength', -100),
#                 frequency=network_data.get('frequency', 2.4),
#                 channel=network_data.get('channel', 1),
#                 encryption=network_data.get('encryption', 'UNKNOWN'),
#                 latitude=network_data.get('latitude', 0.0),
#                 longitude=network_data.get('longitude', 0.0),
#                 vendor=network_data.get('vendor', 'Unknown'),
#                 is_spoof=result['is_spoof'],
#                 features=result['features']
#             )
#             session.add(network)
#             session.commit()
#         except Exception as e:
#             print(f"Database error: {e}")
#             session.rollback()
#         finally:
#             session.close()
    
#     def add_to_blockchain(self, data):
#         """Add detection result to blockchain"""
#         session = BlockchainSessionLocal()
#         try:
#             # Get previous block
#             prev_block = session.query(Block).order_by(Block.index.desc()).first()
#             prev_hash = prev_block.hash if prev_block else "0"
#             index = prev_block.index + 1 if prev_block else 0
            
#             # Create new block
#             timestamp = datetime.utcnow()
#             block_hash = self.calculate_hash(index, prev_hash, data, timestamp)
            
#             block = Block(
#                 index=index,
#                 timestamp=timestamp,
#                 data=data,
#                 previous_hash=prev_hash,
#                 hash=block_hash
#             )
            
#             session.add(block)
#             session.commit()
#         except Exception as e:
#             print(f"Blockchain error: {e}")
#             session.rollback()
#         finally:
#             session.close()
    
#     def calculate_hash(self, index, previous_hash, data, timestamp):
#         """Calculate block hash"""
#         value = f"{index}{previous_hash}{json.dumps(data, sort_keys=True)}{timestamp.isoformat()}".encode()
#         return hashlib.sha256(value).hexdigest()
    
#     def get_blockchain(self):
#         """Retrieve entire blockchain"""
#         session = BlockchainSessionLocal()
#         try:
#             blocks = session.query(Block).order_by(Block.index).all()
#             return [block.to_dict() for block in blocks]
#         finally:
#             session.close()
    
#     def rule_based_detection(self, network):
#         """Enhanced rule-based detection"""
#         reasons = []
        
#         # Check signal strength
#         if network.get('signal_strength', -100) < self.rules['min_signal_strength']:
#             reasons.append(f"Low signal strength: {network.get('signal_strength', -100)}dBm")
        
#         # Check for common rogue SSIDs
#         ssid = network.get('ssid', '')
#         if any(rogue in ssid for rogue in self.rules['common_rogue_ssids']):
#             reasons.append(f"Suspicious SSID: {ssid}")
        
#         # Check encryption
#         encryption = network.get('encryption', 'OPEN').upper()
#         if encryption in ['OPEN', 'WEP']:
#             reasons.append(f"Insecure encryption: {encryption}")
        
#         # Check vendor
#         vendor = network.get('vendor', 'Unknown')
#         if vendor in ['Unknown', 'Rogue', 'Generic']:
#             reasons.append(f"Suspicious vendor: {vendor}")
        
#         # Check for hidden networks
#         if not ssid or ssid.isspace():
#             reasons.append("Hidden network (no SSID)")
        
#         return reasons

# def main():
#     """Main function to demonstrate enhanced WiChain"""
#     print("🚀 Starting Enhanced WiChain: Real-World Wi-Fi Spoofing Detection")
#     print("=" * 70)
    
#     # Initialize detector
#     detector = WiChainDetector()
    
#     # Load real data (example with sample data)
#     print("\n📊 Loading real-world Wi-Fi data...")
#     try:
#         # Try to load real data, fall back to synthetic if not available
#         wifi_data = detector.load_real_data('data/raw/wifi_scans.csv')
#     except:
#         print("Real data not available, using enhanced synthetic data...")
#         wifi_data = generate_enhanced_synthetic_data(1000)
    
#     # Train model
#     print("\n🤖 Training advanced machine learning model...")
#     accuracy = detector.train_model(wifi_data)
    
#     # Test with real-world examples
#     print("\n🔍 Testing with real-world network examples...")
#     print("-" * 50)
    
#     # Test networks
#     test_networks = [
#         {
#             'ssid': 'HomeNetwork',
#             'bssid': 'a4:2b:8c:12:45:ef',
#             'signal_strength': -45,
#             'frequency': 5.0,
#             'channel': 36,
#             'encryption': 'WPA2',
#             'latitude': 19.0760,
#             'longitude': 72.8777,
#             'vendor': 'TP-Link'
#         },
#         {
#             'ssid': 'Free Public WiFi',
#             'bssid': '12:34:56:78:90:ab',
#             'signal_strength': -75,
#             'frequency': 2.4,
#             'channel': 6,
#             'encryption': 'OPEN',
#             'latitude': 19.0760,
#             'longitude': 72.8777,
#             'vendor': 'Unknown'
#         },
#         {
#             'ssid': '',  # Hidden network
#             'bssid': 'aa:bb:cc:dd:ee:ff',
#             'signal_strength': -60,
#             'frequency': 2.4,
#             'channel': 11,
#             'encryption': 'WEP',
#             'latitude': 19.0760,
#             'longitude': 72.8777,
#             'vendor': 'Generic'
#         }
#     ]
    
#     for network in test_networks:
#         result = detector.detect_spoofing(network)
#         print(f"\nNetwork: {network['ssid'] or 'Hidden'}")
#         print(f"Result: {'Spoofed' if result['is_spoof'] else 'Legitimate'}")
#         print(f"ML Confidence: {result['ml_confidence']:.2%}")
    
#     # Show blockchain info
#     blockchain = detector.get_blockchain()
#     print(f"\n⛓  Blockchain length: {len(blockchain)}")
    
#     print("\nEnhanced WiChain demonstration completed!")

# def generate_enhanced_synthetic_data(num_samples=1000):
#     """Generate more realistic synthetic data"""
#     np.random.seed(42)
    
#     data = []
#     for i in range(num_samples):
#         # Real networks (70% of data)
#         if i < num_samples * 0.7:
#             data.append({
#                 'ssid': f'HomeNetwork_{np.random.randint(1, 20)}',
#                 'bssid': f"{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}",
#                 'signal_strength': np.random.randint(-70, -30),
#                 'frequency': np.random.choice([2.4, 5.0]),
#                 'channel': np.random.randint(1, 165),
#                 'encryption': np.random.choice(['WPA2', 'WPA3', 'WPA2/WPA3'], p=[0.7, 0.1, 0.2]),
#                 'latitude': 19.0760 + np.random.uniform(-0.1, 0.1),
#                 'longitude': 72.8777 + np.random.uniform(-0.1, 0.1),
#                 'vendor': np.random.choice(['TP-Link', 'Netgear', 'D-Link', 'Cisco', 'Asus']),
#                 'is_spoof': 0
#             })

#         else:
#             data.append({
#                 'ssid': np.random.choice(['Free WiFi', 'Public WiFi', 'Airport WiFi', 'Starbucks FREE', '']),
#                 'bssid': f"{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}",
#                 'signal_strength': np.random.randint(-85, -50),
#                 'frequency': np.random.choice([2.4, 5.0]),
#                 'channel': np.random.randint(1, 165),
#                 'encryption': np.random.choice(['OPEN', 'WEP', 'WPA'], p=[0.6, 0.3, 0.1]),
#                 'latitude': 19.0760 + np.random.uniform(-0.05, 0.05),
#                 'longitude': 72.8777 + np.random.uniform(-0.05, 0.05),
#                 'vendor': np.random.choice(['Unknown', 'Rogue', 'Generic', '']),
#                 'is_spoof': 1
#             })
    
#     return pd.DataFrame(data)

# if __name__ == "__main__":
#     main()