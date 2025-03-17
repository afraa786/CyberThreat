import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from 'lucide-react';

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const threats = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0,
      maxRadius: 30 + Math.random() * 20,
      speed: 0.5 + Math.random() * 0.5
    }));

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.1)';
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw threats
      threats.forEach(threat => {
        threat.radius += threat.speed;
        if (threat.radius > threat.maxRadius) {
          threat.radius = 0;
          threat.x = Math.random() * canvas.width;
          threat.y = Math.random() * canvas.height;
        }

        const gradient = ctx.createRadialGradient(
          threat.x, threat.y, 0,
          threat.x, threat.y, threat.radius
        );
        gradient.addColorStop(0, 'rgba(255, 86, 86, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 86, 86, 0)');

        ctx.beginPath();
        ctx.arc(threat.x, threat.y, threat.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <Card className="border-neutral-800 bg-black/40">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Globe className="h-4 w-4 text-emerald-400" />
        <CardTitle className="text-sm text-neutral-200">Global Threat Map</CardTitle>
      </CardHeader>
      <canvas
        ref={canvasRef}
        className="w-full h-[200px]"
      />
    </Card>
  );
}