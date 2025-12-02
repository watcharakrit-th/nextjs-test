"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  color: string;
}

const Background3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 400;
    const speed = 5;
    const depth = 2000;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * depth,
        color: `hsl(${Math.random() * 60 + 20}, 100%, 70%)`, // Orange/Yellow hues to match theme
      });
    }

    const render = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Sort particles by Z for depth buffering effect (painters algorithm)
      particles.sort((a, b) => b.z - a.z);

      particles.forEach((p) => {
        // Move particle towards camera
        p.z -= speed;

        // Reset if too close
        if (p.z <= 0) {
          p.z = depth;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        // Perspective projection
        const k = 500 / p.z; // Field of view
        const x = p.x * k + width / 2;
        const y = p.y * k + height / 2;
        const size = (1 - p.z / depth) * 4; // Size based on depth

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          ctx.beginPath();
          ctx.arc(x, y, size > 0 ? size : 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 1 - p.z / depth; // Fade out in distance
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: "black" }}
    />
  );
};

export default Background3D;
