import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

if not VIRUSTOTAL_API_KEY:
    raise ValueError("Missing VirusTotal API Key. Set VIRUSTOTAL_API_KEY in .env file.")

app = FastAPI()

class URLRequest(BaseModel):
    url: str

VIRUSTOTAL_URL = "https://www.virustotal.com/api/v3/urls"

def check_url_safety(url: str):
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }
    data = {"url": url}
    response = requests.post(VIRUSTOTAL_URL, headers=headers, data=data)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error contacting VirusTotal API")
    
    scan_id = response.json().get("data", {}).get("id")
    if not scan_id:
        return False
    
    # Retrieve the scan report
    report_url = f"https://www.virustotal.com/api/v3/analyses/{scan_id}"
    report_response = requests.get(report_url, headers=headers)
    if report_response.status_code != 200:
        return False
    
    report_data = report_response.json()
    
    # Check for phishing detections
    malicious_votes = report_data.get("data", {}).get("attributes", {}).get("stats", {}).get("malicious", 0)
    return malicious_votes > 0

@app.post("/check-url")
def check_url(request: URLRequest):
    is_phishing = check_url_safety(request.url)
    return {"url": request.url, "is_phishing": is_phishing}
