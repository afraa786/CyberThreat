from flask import Flask, request, jsonify, render_template
import numpy as np
import pickle
import warnings
from feature import FeatureExtraction

# Suppress warnings
warnings.filterwarnings('ignore')

# Load ML model
with open("pickle/new_model.pkl", "rb") as file:
    gbc = pickle.load(file)

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form["url"]
        obj = FeatureExtraction(url)
        x = np.array(obj.getFeaturesList()).reshape(1, 30)

        y_pred = gbc.predict(x)[0]
        y_pro_phishing = gbc.predict_proba(x)[0, 0]
        y_pro_safe = gbc.predict_proba(x)[0, 1]

        prediction_text = "It is {0:.2f}% safe to go".format(y_pro_safe * 100)
        return render_template('index.html', xx=round(y_pro_safe, 2), url=url)

    return render_template("index.html", xx=-1)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "Missing 'url' parameter"}), 400

    try:
        obj = FeatureExtraction(url)
        features = np.array(obj.getFeaturesList()).reshape(1, 30)
        prediction = gbc.predict(features)[0]
        proba = gbc.predict_proba(features)[0]

        result = "phishing" if prediction == -1 else "safe"
        return jsonify({
            "prediction": result,
            "probabilities": {
                "safe": float(proba[1]),
                "phishing": float(proba[0])
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
