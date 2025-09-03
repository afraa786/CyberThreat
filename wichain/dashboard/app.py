# wichain/dashboard/api.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import requests
import logging

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("WiChain-API")

app = FastAPI(
    title="Wi-Fi Spoofing Detection Dashboard API",
    description="Provides data for Wi-Fi spoofing detection including network scans and detection results",
    version="1.0"
)

API_BASE = "http://localhost:8000/api"  # backend

# Pydantic model for network features
class NetworkFeature(BaseModel):
    signal_strength: int
    channel: int
    frequency: float
    ssid_length: int
    has_common_rogue_pattern: int
    is_hidden: int
    vendor_risk: int
    is_locally_administered: int
    encryption_risk: int
    signal_category: int
    channel_width: int
    is_DFS_channel: int

class NetworkData(BaseModel):
    ssid: str
    bssid: str
    is_spoof: bool
    vendor: str
    ml_confidence: float
    ml_prediction: int
    timestamp: datetime
    features: NetworkFeature
    reasons: Optional[List[str]] = []

# Helper function to fetch networks from backend
def fetch_networks(limit: int = 20) -> List[Dict[str, Any]]:
    try:
        response = requests.get(f"{API_BASE}/networks?limit={limit}", timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Error fetching networks: {response.status_code}")
            return []
    except Exception as e:
        logger.error(f"Exception fetching networks: {e}")
        return []

# Endpoint for manual input + recent network data
@app.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_data():
    # Manual network input example (default values)
    manual_input = {
        "ssid": "Free Public WiFi",
        "bssid": "12:34:56:78:90:ab",
        "signal_strength": -75,
        "frequency": 2.4,
        "channel": 6,
        "encryption": "OPEN",
        "latitude": 19.08,
        "longitude": 72.88,
        "vendor": "TP-Link"
    }

    # Fetch recent networks
    recent_networks = fetch_networks(limit=20)

    return {
        "dashboard_title": "Wi-Fi Spoofing Detection Dashboard",
        "description": "This dashboard provides real-time monitoring and detection of Wi-Fi spoofing attacks using location-based detection, signal fingerprinting, and machine learning.",
        "manual_network_input": manual_input,
        "recent_networks": recent_networks
    }
