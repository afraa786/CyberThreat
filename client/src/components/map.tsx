import React, { useState } from "react";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState<"ip" | "domain" | "map">("ip");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = "";
      if (type === "ip") {
        url = `http://localhost:8000/threats/ip/${encodeURIComponent(input)}`;
      } else if (type === "domain") {
        url = `http://localhost:8000/threats/domain/${encodeURIComponent(input)}`;
      } else {
        url = `http://localhost:8000/threats/map?limit=10`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">CyberThreat API Test</h1>

      <div className="flex gap-2 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "ip" | "domain" | "map")}
          className="p-2 rounded text-black"
        >
          <option value="ip">Check IP</option>
          <option value="domain">Check Domain</option>
          <option value="map">Live Threat Map</option>
        </select>

        {type !== "map" && (
          <input
            type="text"
            placeholder={`Enter ${type}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-2 rounded text-black w-72"
          />
        )}

        <button
          onClick={callApi}
          disabled={loading || (type !== "map" && !input)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {loading && <p className="text-yellow-400">Loading...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      
      {response && (
        <div className="bg-gray-800 p-4 rounded w-full max-w-4xl text-left">
          <h2 className="font-semibold text-xl mb-4 text-center">Threat Intelligence Results</h2>
          
          {response.results && response.results.map((result: any, index: number) => (
            <div key={result.id || index} className="mb-6 p-4 bg-gray-700 rounded">
              <h3 className="text-lg font-bold text-blue-300 mb-2">{result.name}</h3>
              <p className="mb-3 text-gray-300">{result.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p><span className="font-semibold">Author:</span> {result.author_name}</p>
                  <p><span className="font-semibold">Created:</span> {formatDate(result.created)}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Modified:</span> {formatDate(result.modified)}</p>
                  <p><span className="font-semibold">Revision:</span> {result.revision}</p>
                </div>
              </div>
              
              <h4 className="font-semibold text-md mb-2 text-green-300">Indicators of Compromise ({result.indicators.length})</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Indicator</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.indicators.map((indicator: any, idx: number) => (
                      <tr key={indicator.id || idx} className={idx % 2 === 0 ? 'bg-gray-750' : 'bg-gray-700'}>
                        <td className="px-4 py-2 font-mono">{indicator.indicator}</td>
                        <td className="px-4 py-2">{indicator.type}</td>
                        <td className="px-4 py-2">{formatDate(indicator.created)}</td>
                        <td className="px-4 py-2">{indicator.is_active ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          
          {/* Raw JSON toggle for debugging */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-400">View Raw JSON</summary>
            <pre className="whitespace-pre-wrap break-words text-sm mt-2 p-2 bg-gray-900 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default App;