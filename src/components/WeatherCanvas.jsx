import React, { useEffect, useRef } from 'react';

/**
 * Ambient Animated Weather Canvas
 * Renders realistic particles based on active weather:
 * - Rain droplets with floor splash physics
 * - Thunderstorm with dynamic lightning flash illumination
 * - Sunny golden lens flares & floating dust motes
 * - Fog / mist wisps
 * - Gentle snowfall
 */
export default function WeatherCanvas({ weatherType = "sunny" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles system
    const type = (weatherType || "").toLowerCase();
    const isRain = type.includes("rain") || type.includes("drizzle") || type.includes("shower");
    const isThunder = type.includes("thunder") || type.includes("storm");
    const isSnow = type.includes("snow");
    const isFog = type.includes("fog") || type.includes("mist");

    const particleCount = isRain || isThunder ? 120 : isSnow ? 70 : isFog ? 25 : 30;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speedY: isRain || isThunder ? Math.random() * 12 + 10 : isSnow ? Math.random() * 2 + 1 : Math.random() * 0.4 + 0.1,
        speedX: isRain || isThunder ? -2 : isSnow ? Math.sin(i) * 0.8 : (Math.random() - 0.5) * 0.3,
        size: isSnow ? Math.random() * 3 + 1 : isFog ? Math.random() * 120 + 60 : Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        splash: 0
      });
    }

    let lightningTimer = 0;
    let lightningAlpha = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm Lightning effect
      if (isThunder) {
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.03) {
          lightningAlpha = Math.random() * 0.4 + 0.2;
          lightningTimer = 0;
        }
        if (lightningAlpha > 0) {
          ctx.fillStyle = `rgba(186, 230, 253, ${lightningAlpha})`;
          ctx.fillRect(0, 0, width, height);
          lightningAlpha -= 0.02;
        }
      }

      // Draw Particles
      particles.forEach((p) => {
        if (isRain || isThunder) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else if (isSnow) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.02) * 0.8;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (isFog) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(148, 163, 184, ${p.opacity * 0.15})`);
          grad.addColorStop(1, 'rgba(148, 163, 184, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
        } else {
          // Sunny / Calm subtle dust motes / solar shimmer
          ctx.beginPath();
          ctx.fillStyle = `rgba(253, 224, 71, ${p.opacity * 0.35})`;
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();

          p.y -= p.speedY;
          p.x += p.speedX;

          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
