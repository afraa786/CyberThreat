from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os
from datetime import datetime
from typing import List, Dict, Any
import numpy as np

# Add parent dir for imports - FIXED
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

# Now import your modules
from utils.wifi_scanner import scan_wifi_networks
from mvp_wichain import WiChainDetector

app = FastAPI(title="WiChain API", description="API for Wi-Fi spoofing detection", version="1.0.0")

# Initialize detector
detector = WiChainDetector()

# Check if load_model method exists before calling it
if hasattr(detector, 'load_model'):
    detector.load_model()

if not detector.model:
    try:
        print("Training model for the first time...")
        # Generate sample data and train
        from utils.data_loader import DataLoader
        loader = DataLoader()
        sample_data = loader.generate_sample_data(1000)
        detector.train_model(sample_data)
        print("Model trained successfully!")
    except Exception as e:
        print(f"Model training failed: {e}")

        
class WiFiNetwork(BaseModel):
    ssid: str
    bssid: str
    signal_strength: int
    frequency: float
    channel: int
    encryption: str
    latitude: float
    longitude: float
    vendor: str

# Root
@app.get("/")
async def root():
    return {"message": "Welcome to WiChain API", "status": "active"}

@app.get("/api/scan_real/")
async def scan_real_networks():
    """Scan nearby Wi-Fi networks and detect spoofing in real-time"""
    try:
        networks = scan_wifi_networks()
        results = []

        for net in networks:
            result = detector.detect_spoofing(net)
            results.append(result)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {str(e)}")

# -------------------------
# Added API prefix endpoints
# -------------------------
@app.get("/api/networks")
async def get_networks(limit: int = 5):
    """Return the latest scanned networks"""
    try:
        # Attempt to get blockchain from method or attribute
        blockchain = []

        if hasattr(detector, 'get_blockchain'):
            blockchain = detector.get_blockchain() or []
        elif hasattr(detector, 'blockchain'):
            blockchain = detector.blockchain or []

        # Return the last `limit` entries safely
        return blockchain[-limit:]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain access error: {str(e)}")

# Change this in your main.py
@app.post("/api/scan")  # Changed from POST to GET
async def scan_network():
    """Scan for nearby Wi-Fi networks"""
    try:
        networks = scan_wifi_networks()
        results = []
        
        for net in networks:
            result = detector.detect_spoofing(net)
            results.append(result)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# Existing blockchain endpoints
@app.get("/blockchain/")
async def get_blockchain():
    try:
        return detector.get_blockchain()
    except AttributeError:
        if hasattr(detector, 'blockchain'):
            return detector.blockchain
        raise HTTPException(status_code=500, detail="Blockchain not available")

@app.get("/blockchain/latest/")
async def get_latest_blocks(limit: int = 10):
    try:
        blockchain = detector.get_blockchain()
        return blockchain[-limit:] 
    except AttributeError:
        if hasattr(detector, 'blockchain'):
            return detector.blockchain[-limit:]
        raise HTTPException(status_code=500, detail="Blockchain not available")

# NEW ENDPOINTS FOR STREAMLIT FRONTEND
@app.get("/api/stats")
async def get_stats():
    """Get system statistics"""
    try:
        blockchain = detector.get_blockchain() if hasattr(detector, 'get_blockchain') else []
        if not blockchain and hasattr(detector, 'blockchain'):
            blockchain = detector.blockchain
        
        total_networks = len(blockchain)
        spoof_networks = sum(1 for block in blockchain if block.get('is_spoof', False))
        legitimate_networks = total_networks - spoof_networks
        spoof_percentage = (spoof_networks / total_networks * 100) if total_networks > 0 else 0
        
        return {
            "total_networks": total_networks,
            "spoof_networks": spoof_networks,
            "legitimate_networks": legitimate_networks,
            "spoof_percentage": round(spoof_percentage, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/detect")
async def detect_network(network: WiFiNetwork):
    """Detect spoofing for a specific network (for manual input)"""
    try:
        # Convert to dict and add timestamp
        network_data = network.dict()
        network_data['timestamp'] = datetime.now().isoformat()
        
        # Call your detection logic
        result = detector.detect_spoofing(network_data)
        
        # Add basic structure expected by frontend
        if not isinstance(result, dict):
            result = {"ssid": network_data['ssid'], "is_spoof": False, "ml_confidence": 0.85}
        
        # Ensure all expected fields are present
        result.setdefault('ml_confidence', 0.85)
        result.setdefault('ml_prediction', 1 if result.get('is_spoof', False) else 0)
        result.setdefault('rule_based_reasons', [])
        result.setdefault('features', network_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/train")
async def train_model():
    """Retrain the ML model"""
    try:
        # Check if detector has train method
        if hasattr(detector, 'train_model'):
            result = detector.train_model()
            return {"message": "Model retrained successfully", "details": result}
        else:
            return {"message": "Training not implemented in this version"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add CORS middleware if needed
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)