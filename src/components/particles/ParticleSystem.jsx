import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const ParticleSystem = forwardRef(({ width, height, density }, ref) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const requestRef = useRef();

  useImperativeHandle(ref, () => ({
    emitExplosion: (x, y, color, count = 20) => {
      if (density === 'low') count = Math.floor(count / 2);
      if (density === 'off') return;
      
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
          color,
          size: Math.random() * 4 + 1
        });
      }
    },
    emitLineClear: (y, widthPx, color) => {
      if (density === 'off') return;
      const count = density === 'low' ? 30 : 60;
      
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * widthPx,
          y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 15,
          life: 1,
          decay: Math.random() * 0.03 + 0.01,
          color,
          size: Math.random() * 5 + 2
        });
      }
    }
  }));

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.current.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = `rgb(${p.color})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgb(${p.color})`;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
});

export default ParticleSystem;
