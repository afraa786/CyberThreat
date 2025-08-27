# wichain/backend/models.py
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json
import os

from config import DB_PATH, BLOCKCHAIN_DB_PATH

# Create engines
engine = create_engine(f'sqlite:///{DB_PATH}')
blockchain_engine = create_engine(f'sqlite:///{BLOCKCHAIN_DB_PATH}')

Base = declarative_base()
BlockchainBase = declarative_base()

# Session makers
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
BlockchainSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=blockchain_engine)

# ---------------------------
# ✅ Load OUI data globally
# ---------------------------
OUI_PATH = os.path.join(os.path.dirname(__file__), "oui.json")

try:
    with open(OUI_PATH, "r") as f:
        oui_data = json.load(f)
except FileNotFoundError:
    print(f"[WARN] OUI database not found at {OUI_PATH}")
    oui_data = {}

def get_vendor(bssid: str) -> str:
    """
    Extract vendor from MAC address using oui.json.
    """
    if not bssid:
        return "Unknown"

    # Normalize → take first 6 hex chars
    prefix = bssid.upper().replace(":", "").replace("-", "")[:6]
    return oui_data.get(prefix, "Unknown")

# ---------------------------
# Database models
# ---------------------------

class WiFiNetwork(Base):
    __tablename__ = "wifi_networks"
    
    id = Column(Integer, primary_key=True, index=True)
    ssid = Column(String, index=True)
    bssid = Column(String, unique=True, index=True)
    signal_strength = Column(Integer)
    frequency = Column(Float)
    channel = Column(Integer)
    encryption = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    vendor = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_spoof = Column(Boolean, default=False)
    features = Column(JSON)  # Store extracted features
    
    def to_dict(self):
        return {
            'id': self.id,
            'ssid': self.ssid,
            'bssid': self.bssid,
            'signal_strength': self.signal_strength,
            'frequency': self.frequency,
            'channel': self.channel,
            'encryption': self.encryption,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'vendor': self.vendor,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'is_spoof': self.is_spoof,
            'features': self.features,
        }

class Block(BlockchainBase):
    __tablename__ = "blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    data = Column(JSON)
    previous_hash = Column(String)
    hash = Column(String, unique=True)
    
    def to_dict(self):
        return {
            'index': self.index,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'data': self.data,
            'previous_hash': self.previous_hash,
            'hash': self.hash
        }

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)
    BlockchainBase.metadata.create_all(bind=blockchain_engine)

init_db()
