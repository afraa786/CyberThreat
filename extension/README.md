# CyberThreat ML Chrome Extension

This Chrome extension monitors the current tab's URL and sends it to your ML model endpoint (`/predict`).
It then shows a Chrome notification if the site is safe or suspicious.

## API Expected
POST /predict
Body: { "url": "http://example.com" }
Response: { "threat": true|false, "label": "optional reason" }

## Setup
1. Make sure your ML API is running at `http://localhost:5000/predict` or change `API_URL` in background.js.
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked** → select this folder
5. Visit a website → you'll get a notification about safe/suspicious site.

