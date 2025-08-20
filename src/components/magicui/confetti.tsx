"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export default function Confetti({
  className,
  quantity = 50,
  staticity = 160,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<ConfettiParticle[]>([]);
  const animationFrame = useRef<number>(0);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
  ];

  const initCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        context.current = ctx;
        const rect = canvasContainerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setCanvasSize({ w: rect.width, h: rect.height });
      }
    }
  }, []);

  const createConfetti = useCallback(() => {
    if (!context.current || !canvasSize.w || !canvasSize.h) return;

    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      circles.current.push({
        x: Math.random() * canvasSize.w,
        y: Math.random() * canvasSize.h - canvasSize.h,
        w: Math.random() * 8 + 4,
        h: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 2 + vx,
        vy: Math.random() * 3 + 2 + vy,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
  }, [quantity, canvasSize.w, canvasSize.h, vx, vy]);

  const drawConfetti = useCallback(() => {
    if (!context.current || !canvasSize.w || !canvasSize.h) return;

    context.current.clearRect(0, 0, canvasSize.w, canvasSize.h);

    circles.current.forEach((confetti) => {
      if (!context.current) return;

      context.current.save();
      context.current.translate(
        confetti.x + confetti.w / 2,
        confetti.y + confetti.h / 2
      );
      context.current.rotate((confetti.rotation * Math.PI) / 180);
      context.current.fillStyle = confetti.color;
      context.current.fillRect(
        -confetti.w / 2,
        -confetti.h / 2,
        confetti.w,
        confetti.h
      );
      context.current.restore();
    });
  }, [canvasSize.w, canvasSize.h]);

  const updateConfetti = useCallback(() => {
    circles.current.forEach((confetti) => {
      confetti.x += confetti.vx;
      confetti.y += confetti.vy;
      confetti.rotation += confetti.rotationSpeed;

      // Reset confetti that falls off screen
      if (confetti.y > canvasSize.h + 10) {
        confetti.y = -10;
        confetti.x = Math.random() * canvasSize.w;
      }
      if (confetti.x > canvasSize.w + 10) {
        confetti.x = -10;
      }
      if (confetti.x < -10) {
        confetti.x = canvasSize.w + 10;
      }
    });
  }, [canvasSize.w, canvasSize.h]);

  const animate = useCallback(() => {
    updateConfetti();
    drawConfetti();
    animationFrame.current = requestAnimationFrame(animate);
  }, [updateConfetti, drawConfetti]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  useEffect(() => {
    if (canvasSize.w && canvasSize.h) {
      createConfetti();
      animate();
    }
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [canvasSize.w, canvasSize.h, createConfetti, animate, refresh]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
