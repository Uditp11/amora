'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  createIdleAnimation,
  updateButterflyOnScroll,
  updateButterflyState,
  animateButterflyAscent,
  prefersReducedMotion,
} from '@/lib/animations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ButterflyProps {
  currentSection: number;
  onAscentComplete?: () => void;
  onPositionUpdate?: (x: number, y: number) => void;
  externalSvgPath?: string; // Optional path to external SVG file
}

export default function Butterfly({ 
  currentSection, 
  onAscentComplete,
  onPositionUpdate,
  externalSvgPath 
}: ButterflyProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const leftWingRef = useRef<SVGPathElement>(null);
  const rightWingRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGEllipseElement>(null);
  const idleAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [useExternalSvg, setUseExternalSvg] = useState(false);
  const [externalSvgContent, setExternalSvgContent] = useState<string | null>(null);

  // Load external SVG if provided
  useEffect(() => {
    if (externalSvgPath) {
      fetch(externalSvgPath)
        .then((res) => res.text())
        .then((svg) => {
          setExternalSvgContent(svg);
          setUseExternalSvg(true);
        })
        .catch(() => {
          // Fallback to default if external SVG fails to load
          setUseExternalSvg(false);
        });
    }
  }, [externalSvgPath]);

  // Update position for sparkles
  useEffect(() => {
    if (!onPositionUpdate) return;

    const updatePosition = () => {
      const element = containerRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        onPositionUpdate(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    };
    
    updatePosition();
    const interval = setInterval(updatePosition, 100); // Update every 100ms
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updatePosition);
    };
  }, [onPositionUpdate]);

  useEffect(() => {
    if (!containerRef.current) return;

    // If using external SVG, we need to find elements within it
    if (useExternalSvg && externalSvgContent) {
      // Parse and find wing elements in external SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(externalSvgContent, 'image/svg+xml');
      const leftWing = svgDoc.querySelector('[data-wing="left"]') || svgDoc.querySelector('.left-wing');
      const rightWing = svgDoc.querySelector('[data-wing="right"]') || svgDoc.querySelector('.right-wing');
      const body = svgDoc.querySelector('[data-body]') || svgDoc.querySelector('.body');
      
      if (leftWing && rightWing && body) {
        // Clone elements to our container
        const leftWingEl = leftWing.cloneNode(true) as SVGElement;
        const rightWingEl = rightWing.cloneNode(true) as SVGElement;
        const bodyEl = body.cloneNode(true) as SVGElement;
        
        leftWingEl.setAttribute('data-wing', 'left');
        rightWingEl.setAttribute('data-wing', 'right');
        
        containerRef.current.appendChild(leftWingEl);
        containerRef.current.appendChild(rightWingEl);
        containerRef.current.appendChild(bodyEl);
        
        // Set refs
        (leftWingRef as any).current = leftWingEl;
        (rightWingRef as any).current = rightWingEl;
        (bodyRef as any).current = bodyEl;
      }
    }

    if (!leftWingRef.current || !rightWingRef.current || !bodyRef.current) {
      return;
    }

    // Initial butterfly state (section 0)
    updateButterflyState(containerRef.current, 0);

    // Create idle animation
    idleAnimationRef.current = createIdleAnimation(
      leftWingRef.current,
      rightWingRef.current,
      bodyRef.current
    );

    // Setup scroll direction tracking
    scrollTriggerRef.current = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (leftWingRef.current && rightWingRef.current) {
          updateButterflyOnScroll(
            leftWingRef.current,
            rightWingRef.current,
            self.direction
          );
        }
      },
    });

    return () => {
      if (idleAnimationRef.current) {
        idleAnimationRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [useExternalSvg, externalSvgContent]);

  // Update butterfly state when section changes
  useEffect(() => {
    if (!containerRef.current || !leftWingRef.current || !rightWingRef.current) {
      return;
    }

    updateButterflyState(containerRef.current, currentSection);

    // Handle final section ascent (section 6, index 6)
    if (currentSection === 6) {
      const ascentTimeline = animateButterflyAscent(
        containerRef.current,
        leftWingRef.current,
        rightWingRef.current
      );

      if (onAscentComplete) {
        ascentTimeline.eventCallback('onComplete', onAscentComplete);
      }
    }
  }, [currentSection, onAscentComplete, useExternalSvg]);

  // Render external SVG if provided
  if (useExternalSvg && externalSvgContent) {
    return (
      <div
        ref={containerRef as any}
        className="fixed left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{ transformOrigin: 'center center' }}
        dangerouslySetInnerHTML={{ __html: externalSvgContent }}
      />
    );
  }

  // Default majestic butterfly SVG
  return (
    <svg
      ref={containerRef}
      className="fixed left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      width="200"
      height="180"
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transformOrigin: 'center center' }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ffed4e" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
        <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b6914" />
          <stop offset="50%" stopColor="#b8860b" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left upper wing - majestic pattern */}
      <path
        ref={leftWingRef}
        data-wing="left"
        d="M 50 90 
           Q 20 70, 15 50
           Q 10 30, 20 20
           Q 30 10, 45 15
           Q 35 25, 40 35
           Q 45 50, 50 65
           Q 50 75, 50 90 Z"
        fill="url(#goldGradientDark)"
        transform-origin="50 90"
        style={{ transformOrigin: '50px 90px' }}
        filter="url(#goldGlow)"
      />
      
      {/* Left lower wing */}
      <path
        d="M 50 90
           Q 30 100, 25 110
           Q 20 120, 30 130
           Q 40 135, 50 130
           Q 50 115, 50 90 Z"
        fill="url(#goldGradientDark)"
        opacity="0.8"
      />

      {/* Right upper wing - majestic pattern */}
      <path
        ref={rightWingRef}
        data-wing="right"
        d="M 150 90
           Q 180 70, 185 50
           Q 190 30, 180 20
           Q 170 10, 155 15
           Q 165 25, 160 35
           Q 155 50, 150 65
           Q 150 75, 150 90 Z"
        fill="url(#goldGradientDark)"
        transform-origin="150 90"
        style={{ transformOrigin: '150px 90px' }}
        filter="url(#goldGlow)"
      />
      
      {/* Right lower wing */}
      <path
        d="M 150 90
           Q 170 100, 175 110
           Q 180 120, 170 130
           Q 160 135, 150 130
           Q 150 115, 150 90 Z"
        fill="url(#goldGradientDark)"
        opacity="0.8"
      />

      {/* Wing details - decorative patterns */}
      <circle cx="35" cy="40" r="8" fill="url(#goldGradient)" opacity="0.6" />
      <circle cx="165" cy="40" r="8" fill="url(#goldGradient)" opacity="0.6" />
      <circle cx="30" cy="60" r="5" fill="url(#goldGradient)" opacity="0.4" />
      <circle cx="170" cy="60" r="5" fill="url(#goldGradient)" opacity="0.4" />

      {/* Body */}
      <ellipse
        ref={bodyRef}
        cx="100"
        cy="90"
        rx="6"
        ry="35"
        fill="url(#goldGradient)"
        opacity="0.9"
        filter="url(#goldGlow)"
      />

      {/* Antennae */}
      <line
        x1="100"
        y1="55"
        x2="92"
        y2="40"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#goldGlow)"
      />
      <line
        x1="100"
        y1="55"
        x2="108"
        y2="40"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#goldGlow)"
      />
      <circle cx="92" cy="40" r="2" fill="url(#goldGradient)" filter="url(#goldGlow)" />
      <circle cx="108" cy="40" r="2" fill="url(#goldGradient)" filter="url(#goldGlow)" />
    </svg>
  );
}
