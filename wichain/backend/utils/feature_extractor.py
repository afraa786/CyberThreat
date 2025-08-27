# wichain/utils/feature_extractor.py
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import re
import os
import csv

from config import SIGNAL_BINS, ENCODER_PATH


class FeatureExtractor:
    def __init__(self):
        self.encoders = {}
        self.scaler = StandardScaler()
        self.is_fitted = False

        # ✅ load vendor mapping from oui.csv
        self.oui_map = self.load_oui()

    # -------------------------------
    # Normalize MAC → OUI
    # -------------------------------
    @staticmethod
    def normalize_mac(mac: str) -> str:
        """Normalize MAC address to OUI lookup format (first 6 hex chars)."""
        if not mac:
            return ""
        mac = mac.upper().replace("-", ":").replace(".", "")
        if len(mac) == 12:  # Cisco style (001A2B3C4D5E)
            mac = ":".join(mac[i:i+2] for i in range(0, 12, 2))
        return re.sub(r"[^0-9A-F]", "", mac)[:6]

    # -------------------------------
    # Load OUI database
    # -------------------------------
    def load_oui(self):
        """
        Load OUI → Vendor mapping from a CSV file.
        Expected columns:
          - Assignment / OUI / Prefix / MAC
          - Organization Name / Vendor / Company / Manufacturer
        """
        here = os.path.dirname(__file__)
        candidates = [
            os.path.normpath(os.path.join(here, "..", "oui.csv")),
            os.path.normpath(os.path.join(here, "..", "..", "oui.csv")),
            os.path.normpath(os.path.join(os.getcwd(), "oui.csv")),
        ]
        oui_path = next((p for p in candidates if os.path.exists(p)), None)
        if not oui_path:
            print("⚠️ Could not find oui.csv — vendors will show as Unknown.")
            return {}

        oui_dict = {}
        try:
            with open(oui_path, "r", encoding="utf-8-sig", newline="") as f:
                reader = csv.DictReader(f)
                if reader.fieldnames:
                    fields = [fn.strip().lower() for fn in reader.fieldnames]

                    def pick(opts):
                        for o in opts:
                            if o in fields:
                                return fields.index(o)
                        return None

                    a_idx = pick(["assignment", "oui", "prefix", "mac", "mac prefix", "mac_prefix"])
                    v_idx = pick(["organization name", "organization", "vendor", "company", "manufacturer", "org name"])

                    for row in reader:
                        try:
                            raw_assign = row[reader.fieldnames[a_idx]].strip()
                            raw_vendor = row[reader.fieldnames[v_idx]].strip()
                            prefix = re.sub(r"[^0-9A-Fa-f]", "", raw_assign).upper()[:6]
                            if len(prefix) == 6 and raw_vendor:
                                oui_dict[prefix] = raw_vendor
                        except Exception:
                            continue

            print(f"✅ Loaded {len(oui_dict)} OUIs from {oui_path}")
            return oui_dict
        except Exception as e:
            print(f"⚠️ Failed to read oui.csv ({oui_path}): {e}")
            return {}

    # -------------------------------
    # Vendor lookup
    # -------------------------------
    def get_vendor(self, mac: str) -> str:
        """Return vendor name for a MAC using the OUI database."""
        prefix = self.normalize_mac(mac)
        if not prefix:
            return "Unknown"
        return self.oui_map.get(prefix, "Unknown")

    # -------------------------------
    # Feature extraction
    # -------------------------------
    def extract_features(self, network_data):
        """Extract advanced features from network data"""
        features = {}
        reasons = []

        # Basic features
        features['signal_strength'] = network_data.get('signal_strength', -100)
        features['channel'] = network_data.get('channel', 1)
        features['frequency'] = 2.4 if features['channel'] <= 14 else 5.0

        # SSID-based features
        ssid = network_data.get('ssid', '')
        features['ssid_length'] = len(ssid)
        features['has_common_rogue_pattern'] = self._has_rogue_pattern(ssid)
        features['is_hidden'] = 1 if not ssid or ssid.isspace() else 0

        # BSSID-based features
        bssid = network_data.get('bssid', '00:00:00:00:00:00')
        features['vendor_risk'] = self._get_vendor_risk(bssid)
        features['is_locally_administered'] = self._is_locally_administered(bssid)

        # Attach vendor name
        network_data['vendor'] = self.get_vendor(bssid)

        # Encryption features
        encryption = network_data.get('encryption', 'OPEN').upper()
        features['encryption_risk'] = self._get_encryption_risk(encryption)

        # Signal quality
        features['signal_category'] = self._categorize_signal(features['signal_strength'])

        # Other features
        features['channel_width'] = self._estimate_channel_width(features['channel'])
        features['is_DFS_channel'] = self._is_dfs_channel(features['channel'])

        network_data['features'] = features
        network_data['rule_based_reasons'] = reasons
        return features

    # -------------------------------
    # Helper methods                |
    # -------------------------------
    def _has_rogue_pattern(self, ssid):
     patterns = [
        r'free[\s_-]?wifi', r'public[\s_-]?wifi', r'airport[\s_-]?wifi',
        r'hotel[\s_-]?guest', r'starbucks[\s_-]?free', r'mcdonald[\s_-]?free'
    ]
     return 1 if any(re.search(p, ssid.lower()) for p in patterns) else 0


    def _get_vendor_risk(self, bssid):
        prefix = bssid.replace(":", "").upper()[:6]  # normalize MAC prefix
        vendor = self.oui_map.get(prefix, "Unknown")  # ✅ use self.oui_map instead of undefined oui_data

        trusted = ['000C43', '001A2B', '0022F4', '08EA44']
        risky = ['000000', 'FFFFFF', '123456']

        if prefix in trusted:
            return 0
        elif prefix in risky:
            return 2
        elif vendor == "Unknown":
            return "Mobile Device"
        elif vendor == "Unknown":
            return 1   # treat unknown vendors as high risk
        elif vendor == "Unknown":
          if prefix.startswith(("A69A98")):  # example ranges for mobiles
           return "Mobile Device"
        else:
            return 1
        


    def _is_locally_administered(self, bssid):
        if not bssid or len(bssid) < 2:
            return 0
        first_byte = int(bssid.replace(':', '')[:2], 16)
        return 1 if (first_byte & 0x02) else 0

    def _get_encryption_risk(self, enc):
     risks = {
        'OPEN': 2,   # Still dangerous
        'WEP': 2,    
        'WPA': 1,    # Lowered → don’t mark all WPA as spoof
        'WPA2': 0,
        'WPA3': 0,
        'WPA/WPA2': 0,
        'WPA2/WPA3': 0,
        'UNKNOWN': 1
    }
     return risks.get(enc.upper(), 1)


    def _categorize_signal(self, strength):
        for i, _ in enumerate(SIGNAL_BINS[:-1]):
            if strength >= SIGNAL_BINS[i] and strength < SIGNAL_BINS[i+1]:
                return i
        return len(SIGNAL_BINS) - 1

    def _estimate_channel_width(self, ch):
        return 40 if ch > 14 else 20

    def _is_dfs_channel(self, ch):
        return 1 if ch in [52, 56, 60, 64, 100, 104, 108, 112, 116,
                           120, 124, 128, 132, 136, 140] else 0

    # -------------------------------
    # Training helpers
    # -------------------------------
    def prepare_training_data(self, df):
        feature_data = [self.extract_features(row.to_dict()) for _, row in df.iterrows()]
        feature_df = pd.DataFrame(feature_data)

        # Encode categorical
        for col in ['signal_category']:
            if col in feature_df.columns:
                le = LabelEncoder()
                feature_df[col] = le.fit_transform(feature_df[col].astype(str))
                self.encoders[col] = le

        # Scale numerical
        num_cols = ['signal_strength', 'channel', 'ssid_length']
        num_cols = [c for c in num_cols if c in feature_df.columns]
        if num_cols:
            feature_df[num_cols] = self.scaler.fit_transform(feature_df[num_cols])

        self.is_fitted = True
        joblib.dump((self.encoders, self.scaler), ENCODER_PATH)
        return feature_df

    def transform(self, network_data):
        if not self.is_fitted:
            try:
                self.encoders, self.scaler = joblib.load(ENCODER_PATH)
                self.is_fitted = True
            except:
                raise ValueError("Feature extractor not fitted. Call prepare_training_data first.")

        features = self.extract_features(network_data)
        feature_df = pd.DataFrame([features])

        for col, encoder in self.encoders.items():
            if col in feature_df.columns:
                feature_df[col] = encoder.transform(feature_df[col].astype(str))

        num_cols = ['signal_strength', 'channel', 'ssid_length']
        num_cols = [c for c in num_cols if c in feature_df.columns]
        if num_cols:
            feature_df[num_cols] = self.scaler.transform(feature_df[num_cols])
        return feature_df
