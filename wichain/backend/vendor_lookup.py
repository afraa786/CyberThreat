# wichain/utils/vendor_lookup.py
import json
import os

# Use your exact path to oui.json
OUI_FILE = r"C:\\Users\\Afraa\\Downloads\\wichain\\oui.json"

# Add error handling for file loading
try:
    with open(OUI_FILE, "r") as f:
        OUI_DB = json.load(f)
    print(f"✅ Successfully loaded OUI database with {len(OUI_DB)} entries")
except FileNotFoundError:
    print(f"❌ OUI file not found at: {OUI_FILE}")
    OUI_DB = {}
except Exception as e:
    print(f"❌ Error loading OUI database: {e}")
    OUI_DB = {}

def lookup_vendor(bssid: str) -> str:
    """
    Look up vendor from BSSID (MAC prefix).
    Returns vendor name if found.
    """

    # First 3 octets of MAC (OUI prefix)
    prefix = bssid.upper().replace(":", "").replace("-", "")[:6]
    
    # Try multiple formats for lookup
    formats_to_try = [
        prefix,  # 1027F5
        f"{prefix[:2]}-{prefix[2:4]}-{prefix[4:6]}",  # 10-27-F5
        f"{prefix[:2]}:{prefix[2:4]}:{prefix[4:6]}",   # 10:27:F5
    ]
    
    for oui_format in formats_to_try:
        if oui_format in OUI_DB:
            return OUI_DB[oui_format]
    
def check_vendor_risk(bssid: str) -> (int, str): # type: ignore
    """
    Check vendor risk for a given BSSID.
    Returns (risk_flag, reason_text).
    risk_flag: 1 = suspicious, 0 = safe
    """
    vendor = lookup_vendor(bssid)

    if vendor == "Unknown":
        return 1, "vendor"
    else:
        return 0, f"Vendor: {vendor}"  # Changed to 0 (safe) for known vendors
    
# Test the lookup function
if __name__ == "__main__":
    test_bssid = "10:27:F5:A9:10:45"
    vendor = lookup_vendor(test_bssid)
    risk, reason = check_vendor_risk(test_bssid)
    
    print(f"BSSID: {test_bssid}")
    print(f"Vendor: {vendor}")
    print(f"Risk: {risk} - {reason}")
    
    # Test with a known vendor
    test_known = "00:1A:2B:AA:BB:CC"  # Example Intel OUI
    vendor2 = lookup_vendor(test_known)
    risk2, reason2 = check_vendor_risk(test_known)
    
    print(f"\nBSSID: {test_known}")
    print(f"Vendor: {vendor2}")
    print(f"Risk: {risk2} - {reason2}")