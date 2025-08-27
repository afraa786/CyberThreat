import subprocess
import json
import re
from datetime import datetime
import os
from backend.models import get_vendor

# Use the exact path to your oui.json file
OUI_PATH = r"C:\\Users\\Afraa\\Downloads\\wichain\\backend\\utils\\oui.json"

# Global variable to store OUI data
OUI_DATA = {}

def load_oui_database():
    """
    Load the OUI database from the JSON file
    """
    global OUI_DATA
    
    if not os.path.exists(OUI_PATH):
        print(f"OUI database not found at: {OUI_PATH}")
        print("Please make sure oui.json exists at the specified path")
        return False
    
    try:
        with open(OUI_PATH, "r", encoding='utf-8') as f:
            OUI_DATA = json.load(f)
        print("OUI database loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading OUI database: {e}")
        return False

def get_vendor_from_bssid(bssid):
    """
    Returns the vendor name from the BSSID using the OUI database.
    """
    if not bssid:
        return "Unknown"

    # First try to get vendor from the backend models
    try:
        vendor = get_vendor(bssid)
        if vendor and vendor != "Unknown":
            return vendor
    except Exception as e:
        print(f"Error getting vendor from backend: {e}")

    # If not found in backend or error, try local OUI database
    if not OUI_DATA:
        if not load_oui_database():
            return "Unknown"

    # Clean the BSSID → remove ":" or "-" and uppercase
    prefix = re.sub(r"[^0-9A-F]", "", bssid.upper())[:6]

    # Search for the OUI in the database
    for key, value in OUI_DATA.items():
        # Normalize the key for comparison
        normalized_key = key.replace(":", "").replace("-", "").upper()
        if normalized_key.startswith(prefix):
            if isinstance(value, dict):
                return value.get('companyName', 'Unknown')
            else:
                return str(value)

    return "Unknown"

def scan_wifi_networks():
    networks = []
    
    try:
        # Method 1: Get interface name
        interface_result = subprocess.run(
            ["netsh", "wlan", "show", "interfaces"],
            capture_output=True, text=True, timeout=15
        )
        interface_name = "Wi-Fi"  # default
        for line in interface_result.stdout.splitlines():
            if "Name" in line and ":" in line:
                parts = line.split(":", 1)
                if len(parts) > 1:
                    interface_name = parts[1].strip()
                    break

        # Method 2: Get networks with BSSID
        result = subprocess.run(
            ["netsh", "wlan", "show", "networks", "mode=bssid"],
            capture_output=True, text=True, timeout=30
        )

        print("RAW OUTPUT:")
        for i, line in enumerate(result.stdout.splitlines()):
            print(f"{i}: {line}")

        # Method 3: Parse all networks
        alt_result = subprocess.run(
            ["netsh", "wlan", "show", "all"],
            capture_output=True, text=True, timeout=30
        )

        current_ssid = None
        for line in alt_result.stdout.splitlines():
            line = line.strip()
            
            if line.startswith("SSID"):
                parts = line.split(":", 1)
                if len(parts) > 1:
                    current_ssid = parts[1].strip()
            
            elif current_ssid and "BSSID" in line and ":" in line:
                parts = line.split(":", 1)
                if len(parts) > 1:
                    bssid = parts[1].strip().upper()
                    if re.match(r"^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$", bssid):
                        network_info = {
                            "ssid": current_ssid,
                            "bssid": bssid,
                            "vendor": get_vendor_from_bssid(bssid),
                            "signal_strength": -100,  # default
                            "encryption": "Unknown",
                            "timestamp": datetime.now().isoformat()
                        }
                        networks.append(network_info)
                        current_ssid = None

        # If still no networks found, fallback parsing
        if not networks:
            for line in result.stdout.splitlines():
                if "SSID" in line and ":" in line and "BSSID" not in line:
                    parts = line.split(":", 1)
                    if len(parts) > 1:
                        ssid = parts[1].strip()
                        if ssid:
                            network_info = {
                                "ssid": ssid,
                                "bssid": "",
                                "signal_strength": -100,
                                "encryption": "Unknown",
                                "timestamp": datetime.now().isoformat(),
                                "vendor": "Unknown"
                            }
                            networks.append(network_info)
            
    except Exception as e:
        print(f"Error scanning networks: {e}")
    
    return networks

def analyze_network_security(network):
    """
    Add security analysis to network data.
    Dynamically checks vendor from oui.json and evaluates signal strength.
    """
    vendor = network.get("vendor", "Unknown")

    analysis = {
        "is_spoof": False,
        "rule_based_reasons": [],
        "ml_confidence": 0.0,
        "ml_prediction": 0,
        "features": {
            "signal_strength": network.get("signal_strength", -100),
            "ssid_length": len(network.get("ssid", "")),
            "has_common_rogue_pattern": 0,
            "is_hidden": 0,
            "vendor_name": vendor,
            "vendor_risk": 2 if vendor == "Unknown" else 0,
            "is_locally_administered": 0,
            "encryption_risk": 1 if network.get("encryption") == "Open" else 0,
        }
    }

    # Rule-based detection
    if not network.get("bssid"):
        analysis["rule_based_reasons"].append("Unknown BSSID")
        analysis["is_spoof"] = True
        analysis["features"]["vendor_risk"] = 2

    if vendor == "Unknown":
        analysis["rule_based_reasons"].append(f"vendor: {vendor}")
        analysis["is_spoof"] = True

    if network.get("signal_strength", -100) <= -90:
        analysis["rule_based_reasons"].append(f"Low signal strength: {network.get('signal_strength', -100)}dBm")
        analysis["is_spoof"] = True

    if analysis["is_spoof"]:
        analysis["ml_confidence"] = 0.7
        analysis["ml_prediction"] = 1

    return analysis

if __name__ == "__main__":
    # Load OUI database
    load_oui_database()
    
    print("Scanning WiFi networks with multiple methods...")
    wifi_list = scan_wifi_networks()
    
    # Add security analysis
    for network in wifi_list:
        network.update(analyze_network_security(network))
    
    print("\nDetected Networks with Security Analysis:")
    print(json.dumps(wifi_list, indent=2))
    
    print(f"\n📶 Found {len(wifi_list)} networks:")
    for network in wifi_list:
        status = "🔴" if network["is_spoof"] else "🟢"
        bssid = network["bssid"] if network["bssid"] else "Unknown BSSID"
        vendor = network.get("vendor", "Unknown")
        print(f"{status} {network['ssid']} ({bssid}) - {network['signal_strength']}dBm - Vendor: {vendor}")