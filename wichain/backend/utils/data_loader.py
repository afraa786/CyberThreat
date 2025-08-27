# wichain/utils/data_loader.py
import pandas as pd
import json
import numpy as np
import csv
import os
from datetime import datetime

class DataLoader:
    def __init__(self):
        pass
    
    def load_data(self, file_path):
        """Load Wi-Fi data from various formats"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Data file not found: {file_path}")
        
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.csv':
            return self._load_csv(file_path)
        elif ext == '.json':
            return self._load_json(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")
    
    def _load_csv(self, file_path):
        """Load data from CSV file"""
        df = pd.read_csv(file_path)
        
        # Standardize column names
        column_mapping = {
            'SSID': 'ssid',
            'BSSID': 'bssid',
            'Signal': 'signal_strength',
            'RSSI': 'signal_strength',
            'Frequency': 'frequency',
            'Channel': 'channel',
            'Encryption': 'encryption',
            'Auth': 'encryption',
            'Lat': 'latitude',
            'Lon': 'longitude',
            'Longitude': 'longitude',
            'Vendor': 'vendor',
            'Manufacturer': 'vendor',
            'IsSpoof': 'is_spoof',
            'Spoofed': 'is_spoof'
        }
        
        df.rename(columns=column_mapping, inplace=True)
        
        # Ensure required columns exist
        required_columns = ['ssid', 'bssid', 'signal_strength', 'is_spoof']
        for col in required_columns:
            if col not in df.columns:
                raise ValueError(f"Required column missing: {col}")
        
        return df
    
    def _load_json(self, file_path):
        """Load data from JSON file"""
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Handle different JSON structures
        if isinstance(data, list):
            df = pd.DataFrame(data)
        elif isinstance(data, dict) and 'networks' in data:
            df = pd.DataFrame(data['networks'])
        else:
            raise ValueError("Unsupported JSON structure")
        
        return df
    
    def export_data(self, df, file_path):
        """Export data to file"""
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.csv':
            df.to_csv(file_path, index=False)
        elif ext == '.json':
            df.to_json(file_path, orient='records', indent=2)
        else:
            raise ValueError(f"Unsupported file format: {ext}")
        
        return True
    
    def generate_sample_data(self, num_samples=1000, output_path=None):
        """Generate sample Wi-Fi data for testing"""
        
        np.random.seed(42)
        
        data = []
        for i in range(num_samples):
            # Real networks (70% of data)
            if i < num_samples * 0.7:
                data.append({
                    'ssid': f'HomeNetwork_{np.random.randint(1, 20)}',
                    'bssid': f"{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}",
                    'signal_strength': np.random.randint(-70, -30),
                    'frequency': np.random.choice([2.4, 5.0]),
                    'channel': np.random.randint(1, 165),
                    'encryption': np.random.choice(['WPA2', 'WPA3', 'WPA2/WPA3'], p=[0.7, 0.1, 0.2]),
                    'latitude': 19.0760 + np.random.uniform(-0.1, 0.1),
                    'longitude': 72.8777 + np.random.uniform(-0.1, 0.1),
                    'vendor': np.random.choice(['TP-Link', 'Netgear', 'D-Link', 'Cisco', 'Asus']),
                    'is_spoof': 0,
                    'timestamp': datetime.now().isoformat()
                })
            # Spoofed networks (30% of data)
            else:
                data.append({
                    'ssid': np.random.choice(['Free WiFi', 'Public WiFi', 'Airport WiFi', 'Starbucks FREE', '']),
                    'bssid': f"{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}:{np.random.randint(0x00, 0xFF):02x}",
                    'signal_strength': np.random.randint(-85, -50),
                    'frequency': np.random.choice([2.4, 5.0]),
                    'channel': np.random.randint(1, 165),
                    'encryption': np.random.choice(['OPEN', 'WEP', 'WPA'], p=[0.6, 0.3, 0.1]),
                    'latitude': 19.0760 + np.random.uniform(-0.05, 0.05),
                    'longitude': 72.8777 + np.random.uniform(-0.05, 0.05),
                    'vendor': np.random.choice(['Unknown', 'Rogue', 'Generic', '']),
                    'is_spoof': 1,
                    'timestamp': datetime.now().isoformat()
                })
        
        df = pd.DataFrame(data)
        
        if output_path:
            self.export_data(df, output_path)
        
        return df