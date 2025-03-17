import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function DashboardCard({ title, value, icon, className, glowColor = "rgba(0, 255, 170, 0.2)" }: DashboardCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-neutral-800 bg-black/40 backdrop-blur-sm",
      className
    )}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`
        }}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-200">{title}</CardTitle>
        <div className="text-emerald-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-50">{value}</div>
      </CardContent>
    </Card>
  );
}