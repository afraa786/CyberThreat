import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, AlertTriangle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "breach",
    message: "Unauthorized access attempt detected",
    timestamp: "2 minutes ago",
    icon: AlertTriangle,
    severity: "high",
  },
  {
    id: 2,
    type: "security",
    message: "Firewall rules updated",
    timestamp: "15 minutes ago",
    icon: Shield,
    severity: "medium",
  },
  {
    id: 3,
    type: "activity",
    message: "System scan completed",
    timestamp: "1 hour ago",
    icon: Activity,
    severity: "low",
  },
  // Add more activities as needed
];

const severityColors = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-emerald-400",
};

export function ActivityLog() {
  return (
    <Card className="border-neutral-800 bg-black/40">
      <CardHeader>
        <CardTitle className="text-neutral-200">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3"
                >
                  <div className={severityColors[activity.severity]}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-neutral-200">
                      {activity.message}
                    </p>
                    <p className="text-xs text-neutral-400">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}