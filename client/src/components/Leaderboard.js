export default function Leaderboard() {
    const users = [
      { username: "CyberWarrior", xp: 1200 },
      { username: "HackerX", xp: 1100 },
      { username: "ThreatHunter", xp: 1050 }
    ];
  
    return (
      <div className="card">
        <h2>🏆 Leaderboard</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{index + 1}. {user.username} - {user.xp} XP</li>
          ))}
        </ul>
      </div>
    );
  }
  