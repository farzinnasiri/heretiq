import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  decay: number;
}

export const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = Date.now();
    const keepStatic =
      window.matchMedia('(max-width: 1023px)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const starPalettes = [
      'rgba(235, 242, 255,', // pure cool white/silver (80%)
      'rgba(235, 242, 255,',
      'rgba(235, 242, 255,',
      'rgba(235, 242, 255,',
      'rgba(180, 215, 255,', // faint celestial ice blue (10%)
      'rgba(255, 238, 205,', // subtle warm starlight gold (10%)
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initStars();
    };

    const initStars = () => {
      const count = keepStatic
        ? Math.max(38, Math.min(55, Math.floor((width * height) / 14000)))
        : Math.max(70, Math.min(150, Math.floor((width * height) / 9500)));
      stars = [];

      for (let i = 0; i < count; i++) {
        // A few landmark anchor stars have slightly larger diameter (constellation nodes)
        const isAnchor = i % 12 === 0;
        const radius = isAnchor
          ? 1.8 + Math.random() * 0.8
          : 0.7 + Math.random() * 0.9;

        const color = starPalettes[Math.floor(Math.random() * starPalettes.length)];
        const baseAlpha = isAnchor
          ? 0.55 + Math.random() * 0.35
          : 0.2 + Math.random() * 0.45;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius,
          baseAlpha,
          twinkleSpeed: 0.0018 + Math.random() * 0.004,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
        });
      }
    };

    const spawnShootingStar = () => {
      const startX = Math.random() * (width * 0.8) + width * 0.1;
      const startY = Math.random() * (height * 0.4);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 deg downward streak
      const speed = 7 + Math.random() * 4;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 60 + Math.random() * 40,
        alpha: 0.85,
        decay: 0.02 + Math.random() * 0.015,
      });
    };

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastShootingStarTime = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const maxLineDist = width < 640 ? 95 : 125;
    const maxNeighbors = 2; // Keep clean geometric asterisms without dense mesh clutter

    const render = (now: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep space subtle vignette backing
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, '#080C16');
      grad.addColorStop(0.65, '#05070D');
      grad.addColorStop(1, '#030408');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint constellation hairlines between neighboring stars
      ctx.lineWidth = 0.55;
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        let connections = 0;

        for (let j = i + 1; j < stars.length; j++) {
          if (connections >= maxNeighbors) break;

          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxLineDist * maxLineDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxLineDist) * 0.11;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 210, 255, ${lineAlpha})`;
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();

            connections++;
          }
        }
      }

      // Draw stars with organic twinkle & subtle drift on capable viewports.
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!keepStatic) {
          s.x += s.vx;
          s.y += s.vy;
        }

        // Wrap around viewport boundaries smoothly
        if (s.x < -10) s.x = width + 10;
        else if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        else if (s.y > height + 10) s.y = -10;

        // Twinkle factor
        const twinkle = keepStatic ? 0 : Math.sin(now * s.twinkleSpeed + s.twinklePhase);
        const currentAlpha = Math.max(0.12, Math.min(1, s.baseAlpha + twinkle * 0.25));

        ctx.beginPath();
        ctx.fillStyle = `${s.color} ${currentAlpha})`;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra subtle aura on anchor stars
        if (s.radius > 1.8) {
          ctx.beginPath();
          ctx.fillStyle = `${s.color} ${currentAlpha * 0.25})`;
          ctx.arc(s.x, s.y, s.radius * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rare shooting star (every 8-14 seconds)
      const nowMs = Date.now();
      if (!keepStatic && nowMs - lastShootingStarTime > 9000 && Math.random() < 0.008) {
        spawnShootingStar();
        lastShootingStarTime = nowMs;
      }

      // Render active shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha -= ss.decay;

        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
        const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

        const streakGrad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        streakGrad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
        streakGrad.addColorStop(0.3, `rgba(180, 220, 255, ${ss.alpha * 0.7})`);
        streakGrad.addColorStop(1, 'rgba(180, 220, 255, 0)');

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = streakGrad;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      if (!keepStatic) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      resize();
      if (keepStatic) render(performance.now());
    };

    resize();
    render(performance.now());
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full select-none"
      aria-hidden="true"
    />
  );
};
