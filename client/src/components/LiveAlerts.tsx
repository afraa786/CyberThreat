import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ShieldAlert, Wifi, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const alertTypes = [
  { icon: ShieldAlert, color: "text-red-400", label: "Security" },
  { icon: Wifi, color: "text-blue-400", label: "Network" },
  { icon: Lock, color: "text-yellow-400", label: "Access" },
];

export function LiveAlerts() {
  const [activeAlert, setActiveAlert] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAlert((prev) => (prev + 1) % alertTypes.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-neutral-800 bg-black/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-200">Live Alerts</CardTitle>
        <Bell className="h-4 w-4 text-emerald-400" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {alertTypes.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.label}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300",
                  index === activeAlert ? "bg-neutral-800/50 scale-105" : "bg-neutral-900/30"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-2", alert.color)} />
                <span className="text-xs text-neutral-400">{alert.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}