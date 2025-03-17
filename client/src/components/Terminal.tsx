import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal as TerminalIcon } from 'lucide-react';

const commands = [
  { input: "scan network", output: "Scanning network for vulnerabilities..." },
  { input: "check firewall", output: "Firewall status: Active | Rules updated: 127" },
  { input: "system stats", output: "CPU: 42% | Memory: 6.2GB/16GB | Processes: 142" }
];

export function Terminal() {
  const [history, setHistory] = useState<Array<{ input?: string; output: string }>>([
    { output: "HackDash Terminal v1.0.0" },
    { output: "Type 'help' for available commands" },
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = commands.find(cmd => cmd.input === input.trim().toLowerCase());
      setHistory(prev => [
        ...prev,
        { input: input.trim(), output: command?.output || "Command not recognized" }
      ]);
      setInput("");
    }
  };

  return (
    <Card className="border-neutral-800 bg-black/40">
      <CardHeader className="flex flex-row items-center space-x-2">
        <TerminalIcon className="h-4 w-4 text-emerald-400" />
        <CardTitle className="text-sm text-neutral-200">Terminal</CardTitle>
      </CardHeader>
      <CardContent className="font-mono text-sm">
        <div className="h-[200px] overflow-auto space-y-2 mb-2">
          {history.map((entry, i) => (
            <div key={i}>
              {entry.input && (
                <div className="text-neutral-400">$ {entry.input}</div>
              )}
              <div className="text-emerald-400">{entry.output}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-neutral-400">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-neutral-200"
            placeholder="Enter command..."
          />
        </div>
      </CardContent>
    </Card>
  );
}