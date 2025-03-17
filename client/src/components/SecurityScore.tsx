import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";

export function SecurityScore() {
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    const targetScore = 87;
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-neutral-800 bg-black/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-200">Security Score</CardTitle>
        <Shield className="h-4 w-4 text-emerald-400" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-3xl font-bold text-emerald-400">{Math.round(score)}%</span>
          <div className="text-right">
            <div className="text-sm text-neutral-200">Protection Level</div>
            <div className="text-xs text-neutral-400">Advanced</div>
          </div>
        </div>
        <Progress 
          value={score} 
          className="h-2"
          indicatorClass="bg-gradient-to-r from-emerald-400 to-cyan-400" 
        />
      </CardContent>
    </Card>
  );
}