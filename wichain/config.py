# wichain/config.py
import os

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Data paths
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')

# Model paths
MODEL_DIR = os.path.join(BASE_DIR, 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'wichain_model.pkl')
ENCODER_PATH = os.path.join(MODEL_DIR, 'feature_encoder.pkl')

# Database paths
DB_PATH = os.path.join(BASE_DIR, 'backend', 'db.sqlite')
BLOCKCHAIN_DB_PATH = os.path.join(BASE_DIR, 'blockchain', 'blockchain.db')

# API settings
API_HOST = "0.0.0.0"
API_PORT = 8000

# ML settings
MODEL_PARAMS = {
    'n_estimators': 200,
    'max_depth': 10,
    'random_state': 42,
    'class_weight': 'balanced'
}

# Feature settings
SIGNAL_BINS = [-100, -85, -70, -55, -40]  # dBm ranges