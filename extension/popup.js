document.addEventListener("DOMContentLoaded", function () {
  // Auto-check current tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var url = tabs[0].url;
    document.getElementById("url-input").value = url;
    checkPhishing(url, "check");
  });

  // Manual form submission
  document
    .getElementById("url-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var url = document.getElementById("url-input1").value;
      checkPhishing(url, "result");
    });
});

function checkPhishing(url, classname) {
  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("ML API Response:", data);

      var resultDiv = document.getElementsByClassName(classname)[0];

      if (data.error) {
        resultDiv.innerHTML = "Error: " + data.error;
        resultDiv.style.color = "red";
      } else if (data.prediction) {
        if (data.prediction === "phishing") {
          resultDiv.innerHTML = `Phishing detected! <br>Safe Probability: ${(
            data.probabilities.safe * 100
          ).toFixed(2)}%`;
          resultDiv.style.color = "orange";
        } else {
          resultDiv.innerHTML = `Safe! <br>Safe Probability: ${(
            data.probabilities.safe * 100
          ).toFixed(2)}%`;
          resultDiv.style.color = "green";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      var resultDiv = document.getElementsByClassName(classname)[0];
      resultDiv.innerHTML = "Could not connect to ML API";
      resultDiv.style.color = "red";
    });
}
