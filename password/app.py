from flask import Flask, request, jsonify
import hashlib
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

def check_password_pwned(password: str) -> int:
    sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]
    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    response = requests.get(url)
    if response.status_code != 200:
        raise RuntimeError(f"API request failed: {response.status_code}")
    
    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return int(count)
    return 0

@app.route("/check-password", methods=["POST"])
def check_password():
    data = request.json
    password = data.get("password")
    if not password:
        return jsonify({"error": "Password is required"}), 400

    count = check_password_pwned(password)
    return jsonify({"password": password, "pwned_count": count})

if __name__ == "__main__":
    app.run(debug=True)
