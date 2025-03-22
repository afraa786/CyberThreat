import { useState } from "react";
import "./ThreatReportApp.css";

export default function ThreatReportApp() {
  const [threat, setThreat] = useState("");
  const [platform, setPlatform] = useState("");
  const [dateHeard, setDateHeard] = useState("");
  const [firstStep, setFirstStep] = useState("");
  const [threatType, setThreatType] = useState("");
  const [phishingURL, setPhishingURL] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [linkedinURL, setLinkedinURL] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);

  interface ValidateDateFunction {
    (date: string): boolean;
  }

  const validateDate: ValidateDateFunction = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date <= today;
  };

  const validateURL = (url: string): boolean => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + 
      "((([a-zA-Z0-9$-_@.&+!*\"(),]+)\\.)+[a-zA-Z]{2,6})" + 
      "(\\/[a-zA-Z0-9$-_@.&+!*\"(),]*)*$"
    );
    return urlPattern.test(url);
  };

  const handleSubmit = () => {
    if (!validateDate(dateHeard)) {
      alert("Invalid date! Please enter a valid past date.");
      return;
    }
    if (phishingURL && !validateURL(phishingURL)) {
      alert("Invalid URL format!");
      return;
    }
    console.log({
      threat,
      platform,
      dateHeard,
      firstStep,
      threatType,
      phishingURL,
      incidentLocation,
      additionalInfo,
      delayReason,
      linkedinURL,
      evidence,
    });
    alert("🚀 Report submitted successfully!");
  };

  return (
    <div className="cyberpunk-container">
      <h1 className="cyberpunk-title">🚨 Cyber Threat Report</h1>

      <div className="cyberpunk-box">
        <input
          type="text"
          placeholder="Enter threat details..."
          className="cyberpunk-input"
          value={threat}
          onChange={(e) => setThreat(e.target.value)}
        />

        <input
          type="text"
          placeholder="Platform where threat was heard..."
          className="cyberpunk-input"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />

        <input
          type="date"
          className="cyberpunk-input"
          value={dateHeard}
          onChange={(e) => setDateHeard(e.target.value)}
        />

        <select
          className="cyberpunk-input"
          value={threatType}
          onChange={(e) => setThreatType(e.target.value)}
        >
          <option value="">Select Threat Type</option>
          <option value="Phishing">Phishing</option>
          <option value="Malware">Malware</option>
          <option value="Ransomware">Ransomware</option>
          <option value="Social Engineering">Social Engineering</option>
          <option value="DDoS Attack">DDoS Attack</option>
          <option value="Other">Any other online platform</option>
        </select>

        {threatType === "Phishing" && (
          <input
            type="text"
            placeholder="Enter phishing URL..."
            className="cyberpunk-input"
            value={phishingURL}
            onChange={(e) => setPhishingURL(e.target.value)}
          />
        )}

        {/* Where did the incident occur? */}
        <select
          className="cyberpunk-input"
          value={incidentLocation}
          onChange={(e) => setIncidentLocation(e.target.value)}
        >
          <option value="">Where did the incident occur?</option>
<option value="youtube">YouTube</option>
<option value="instagram">Instagram</option>
<option value="twitter">Twitter/X</option>
<option value="linkedin">LinkedIn</option>
<option value="facebook">Facebook</option>
<option value="tiktok">TikTok</option>
<option value="snapchat">SnapChat</option>
<option value="other-online">Other Online Platform</option>
<option value="offline">Offline Pamphlet</option>
<option value="other">Other</option>    </select>

        {/* Additional Information */}
        <textarea
          className="cyberpunk-textarea"
          placeholder="Additional information about the incident (Min 150, Max 1500 characters)"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          minLength={150}
          maxLength={1500}
        />

        {/* Reason for delay in reporting */}
        <input
          type="text"
          placeholder="Reason for delay in reporting"
          className="cyberpunk-input"
          value={delayReason}
          onChange={(e) => setDelayReason(e.target.value)}
        />

        {/* LinkedIn URL */}
        <input
          type="url"
          placeholder="LinkedIn Handle / URL"
          className="cyberpunk-input"
          value={linkedinURL}
          onChange={(e) => setLinkedinURL(e.target.value)}
        />

        {/* Upload Evidence */}
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          className="cyberpunk-input"
          onChange={(e) => setEvidence(e.target.files ? e.target.files[0] : null)}
        />

        {/* What would be your first step? */}
        <textarea
          placeholder="What would be your first step?"
          className="cyberpunk-input"
          value={firstStep}
          onChange={(e) => setFirstStep(e.target.value)}
        />

        <button className="cyberpunk-button" onClick={handleSubmit}>
          Submit Report
        </button>
      </div>

      <div className="cyberpunk-footer">
        🎮 Earn XP for every valid report! Level up in the Cyber Security community.
      </div>
    </div>
  );
}
