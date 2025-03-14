import ThreatList from "./components/ThreatList";
import ThreatMap from "./components/ThreatMap";
import Leaderboard from "./components/Leaderboard";

export default function App() {
  return (
    <div className="container">
      <h1>⚡ Cyber Threat Intelligence Dashboard⚡</h1>
      <ThreatList />
      <ThreatMap />
      <Leaderboard />
    </div>
  );
}
