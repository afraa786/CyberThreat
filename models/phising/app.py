import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env variables
load_dotenv()
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

if not VIRUSTOTAL_API_KEY:
    raise ValueError("Missing VirusTotal API Key. Set VIRUSTOTAL_API_KEY in .env file.")

app = FastAPI()

# === Pydantic Models ===
class URLRequest(BaseModel):
    url: str

class ThreatRequest(BaseModel):
    url: str
    message: str = ""
    evidence: str = ""
    type: str = ""
    firstStep: str = ""

# === VirusTotal Scan ===
VIRUSTOTAL_URL = "https://www.virustotal.com/api/v3/urls"

def check_url_safety(url: str):
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }
    data = {"url": url}
    response = requests.post(VIRUSTOTAL_URL, headers=headers, data=data)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="VirusTotal scan failed")

    scan_id = response.json().get("data", {}).get("id")
    if not scan_id:
        return False

    # Get scan report
    report_url = f"https://www.virustotal.com/api/v3/analyses/{scan_id}"
    report_response = requests.get(report_url, headers=headers)
    if report_response.status_code != 200:
        return False

    stats = report_response.json().get("data", {}).get("attributes", {}).get("stats", {})
    malicious_votes = stats.get("malicious", 0)
    return malicious_votes > 0

# === Endpoint: VirusTotal Check ===
@app.post("/check-url")
def check_url(request: URLRequest):
    is_phishing = check_url_safety(request.url)
    return {"url": request.url, "is_phishing": is_phishing}

# === Endpoint: Basic Threat Prediction ===
@app.post("/predict")
def predict(request: ThreatRequest):
    # Mock logic
    if "phish" in request.url.lower() or "urgent" in request.message.lower():
        return {"prediction": "phishing"}
    else:
        return {"prediction": "safe"}
