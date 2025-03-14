export default function ThreatList() {
    const threats = ["Phishing Attack", "Malware Infection", "SQL Injection"];
  
    return (
      <div className="card">
        <h2>Threat List</h2>
        <ul>
          {threats.map((threat, index) => (
            <li key={index}>⚠ {threat}</li>
          ))}
        </ul>
      </div>
    );
  }
  