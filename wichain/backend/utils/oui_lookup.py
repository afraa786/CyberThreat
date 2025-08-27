import requests
import json
import os

def download_oui_database():
    url = "http://standards-oui.ieee.org/oui/oui.json"
    output_path = "C:\\Users\\Afraa\\Downloads\\wichain\\backend\\utils\\oui.json"
    
    print("Downloading OUI database...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Create utils directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        print(f"OUI database downloaded successfully to {output_path}")
        return True
    except Exception as e:
        print(f"Failed to download OUI database: {e}")
        return False

if __name__ == "__main__":
    download_oui_database()