'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface SparklesProps {
  butterflyX: number;
  butterflyY: number;
  intensity: number; // 0-1, based on section/scroll
}

export default function Sparkles({ butterflyX, butterflyY, intensity }: SparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sparklesRef = useRef<HTMLDivElement[]>([]);

  const createSparkle = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const sparkle = document.createElement('div');
    sparkle.className = 'absolute pointer-events-none';
    
    // Use butterfly position or fallback to viewport center
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight * 0.45;
    
    const sparkleX = (butterflyX > 0 && butterflyY > 0) ? butterflyX : centerX;
    const sparkleY = (butterflyX > 0 && butterflyY > 0) ? butterflyY : centerY;
    
    // Start at butterfly position (epicenter) or center
    sparkle.style.left = `${sparkleX}px`;
    sparkle.style.top = `${sparkleY}px`;
    
    // Size varies with intensity (smaller when dimmer, but always visible)
    // At intensity 0: 1.5-2.5px, at intensity 1: 5-8px
    const baseSize = 1.5 + intensity * 3.5;
    const size = baseSize + Math.random() * (0.5 + intensity * 2.5);
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.borderRadius = '50%';
    
    // Opacity scales with intensity (dimmer at start, brighter at peak)
    // At intensity 0: 0.15-0.25, at intensity 1: 0.85-0.95
    const baseOpacity = 0.15 + intensity * 0.7; // 0.15 to 0.85
    const sparkleOpacity = baseOpacity + Math.random() * 0.1;
    
    // Glow intensity also scales with intensity
    // At intensity 0: 1-2px glow, at intensity 1: 10-11px glow
    const glowSize1 = 1 + intensity * 10; // 1 to 11
    const glowSize2 = 2 + intensity * 19; // 2 to 21
    const glowOpacity = 0.15 + intensity * 0.65; // 0.15 to 0.8
    
    sparkle.style.background = `radial-gradient(circle, #ffd700 ${Math.random() * 20 + 70}%, transparent)`;
    sparkle.style.boxShadow = `0 0 ${glowSize1}px #ffd700, 0 0 ${glowSize2}px rgba(255, 215, 0, ${glowOpacity})`;
    sparkle.style.opacity = '0';
    
    container.appendChild(sparkle);
    sparklesRef.current.push(sparkle);

    // Calculate random destination across entire viewport
    
    // Random destination anywhere on screen (spreading outward from butterfly)
    const angle = Math.random() * Math.PI * 2;
    const maxDistance = Math.sqrt(viewportWidth ** 2 + viewportHeight ** 2) * 0.7;
    const distance = 50 + Math.random() * maxDistance;
    
    const endX = sparkleX + Math.cos(angle) * distance;
    const endY = sparkleY + Math.sin(angle) * distance;
    
    const padding = 50;
    const finalX = Math.max(-padding, Math.min(viewportWidth + padding, endX));
    const finalY = Math.max(-padding, Math.min(viewportHeight + padding, endY));
    
    const duration = 2 + Math.random() * 3 + (distance / 200);
    
    // Animate sparkle from butterfly to destination
    gsap.fromTo(
      sparkle,
      {
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0,
      },
      {
        opacity: sparkleOpacity,
        scale: 1,
        x: finalX - sparkleX,
        y: finalY - sparkleY,
        duration,
        ease: 'power1.out',
        onComplete: () => {
          gsap.to(sparkle, {
            opacity: 0,
            scale: 0.2,
            duration: 1,
            ease: 'power2.in',
            onComplete: () => {
              if (sparkle.parentNode) {
                sparkle.remove();
              }
              sparklesRef.current = sparklesRef.current.filter(s => s !== sparkle);
            },
          });
        },
      }
    );
  }, [butterflyX, butterflyY, intensity]);

  useEffect(() => {
    // Always emit sparkles from the start, but frequency scales with intensity
    // At intensity 0: 1200ms interval (slow), at intensity 1: 200ms (fast)
    // This ensures sparkles are always present, just less frequent at start
    const baseInterval = 1200 - intensity * 1000;
    const interval = Math.max(200, baseInterval);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      // Number of sparkles per emission: 1 at start (intensity 0), up to 5 at peak (intensity 1)
      const count = Math.max(1, Math.floor(1 + intensity * 4));
      for (let i = 0; i < count; i++) {
        setTimeout(() => createSparkle(), i * 80);
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Cleanup all sparkles
      sparklesRef.current.forEach((sparkle) => {
        gsap.killTweensOf(sparkle);
        if (sparkle.parentNode) {
          sparkle.remove();
        }
      });
      sparklesRef.current = [];
    };
  }, [createSparkle, intensity]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}
