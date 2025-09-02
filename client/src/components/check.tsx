import React, { useState, useEffect } from "react";

interface ScanResult {
  success: boolean;
  scanId?: string;
  error?: string;
}

interface Credits {
  emerald: number;
  sapphire: number;
  aml: number;
}

const HIBPStyleCheck: React.FC = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [connectionError, setConnectionError] = useState(false);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch("http://localhost:5000/credits");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCredits(data);
      setConnectionError(false);
    } catch (err) {
      console.error("Failed to fetch credits:", err);
      setConnectionError(true);
    }
  };

  const checkEmail = async () => {
    if (!email) {
      alert("Please enter an email!");
      return;
    }

    if (!credits || (credits.emerald === 0 && credits.sapphire === 0)) {
      alert("No credits remaining!");
      return;
    }

    setLoading(true);
    setResult(null);
    setConnectionError(false);

    try {
      const res = await fetch("http://localhost:5000/scan-email-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "",
          lastName: "", 
          dob: "",
          email
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      
      // Refresh credits after scan
      await fetchCredits();
    } catch (err: any) {
      console.error("Scan failed:", err);
      setResult({ success: false, error: "Failed to connect to server. Make sure the backend is running on port 5000." });
      setConnectionError(true);
    }

    setLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#0b0c1a",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Have I Been Pwned?</h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.2rem", textAlign: "center" }}>
        Check if your email address is in a data breach
      </p>

      {connectionError && (
        <div style={{
          backgroundColor: "#ff4444",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          ⚠️ Cannot connect to backend server. Make sure it's running on port 5000.
        </div>
      )}

      <div style={{ display: "flex", width: "100%", maxWidth: "400px", marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "6px 0 0 6px",
            border: "none",
            fontSize: "1rem"
          }}
        />
        <button
          onClick={checkEmail}
          disabled={loading || !credits || (credits.emerald === 0 && credits.sapphire === 0)}
          style={{
            padding: "12px 20px",
            backgroundColor: "#0078d7",
            border: "none",
            borderRadius: "0 6px 6px 0",
            color: "#fff",
            fontSize: "1rem",
            cursor: (loading || !credits || (credits.emerald === 0 && credits.sapphire === 0)) ? "not-allowed" : "pointer",
            opacity: (loading || !credits || (credits.emerald === 0 && credits.sapphire === 0)) ? 0.6 : 1
          }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {credits && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <p>Emerald Credits: {credits.emerald}</p>
          <p>Sapphire Credits: {credits.sapphire}</p>
          <p>AML Credits: {credits.aml}</p>
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: "20px", 
          fontSize: "1.1rem",
          padding: "15px",
          borderRadius: "5px",
          backgroundColor: result.success ? "#2d4a2d" : "#4a2d2d",
          textAlign: "center"
        }}>
          {result.success ? (
            <span style={{ color: "lightgreen" }}>✅ Scan completed! Scan ID: {result.scanId}</span>
          ) : (
            <span style={{ color: "#ff8888" }}>❌ {result.error || "Scan failed"}</span>
          )}
        </div>
      )}

      <div style={{ marginTop: "30px", fontSize: "0.9rem", color: "#aaa", textAlign: "center" }}>
        <p>Backend: http://localhost:5000</p>
        <p>Make sure your Flask server is running on port 5000</p>
      </div>
    </div>
  );
};

export default HIBPStyleCheck;