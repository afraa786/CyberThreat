export default function ThreatsList() {
    // Dummy data (Instead of fetching from API)
    const threats = [
      { id: 1, name: "Phishing Attack" },
      { id: 2, name: "Malware Infection" },
      { id: 3, name: "SQL Injection" },
    ];
  
    return (
      <div>
        <h1>Threat List</h1>
        <ul>
          {threats.map((threat) => (
            <li key={threat.id}>{threat.name}</li>
          ))}
        </ul>
      </div>
    );
  }
  