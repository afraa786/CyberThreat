import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, CircuitBoard } from "lucide-react";

const resources = [
  {
    icon: Cpu,
    name: "CPU Usage",
    used: 42,
    total: 100,
    color: "bg-emerald-400"
  },
  {
    icon: CircuitBoard,
    name: "Memory",
    used: 6.2,
    total: 16,
    color: "bg-blue-400"
  },
  {
    icon: HardDrive,
    name: "Storage",
    used: 234,
    total: 512,
    color: "bg-purple-400"
  }
];

export function SystemResources() {
  return (
    <Card className="border-neutral-800 bg-black/40">
      <CardHeader>
        <CardTitle className="text-sm text-neutral-200">System Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource) => {
          const Icon = resource.icon;
          const percentage = (resource.used / resource.total) * 100;
          
          return (
            <div key={resource.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-neutral-400" />
                  <span className="text-neutral-200">{resource.name}</span>
                </div>
                <span className="text-neutral-400">
                  {resource.used} / {resource.total}
                  {resource.name === "Memory" || resource.name === "Storage" ? "GB" : "%"}
                </span>
              </div>
              <Progress value={percentage} className="h-1" indicatorClass={resource.color} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}