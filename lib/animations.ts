import { gsap } from 'gsap';

/**
 * Animation utilities for the butterfly and text elements
 * All animations respect prefers-reduced-motion
 */

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Creates a gentle idle animation for the butterfly
 * Slow wing flaps with subtle breathing motion
 */
export const createIdleAnimation = (
  leftWing: SVGElement,
  rightWing: SVGElement,
  body: SVGElement
): gsap.core.Timeline => {
  const timeline = gsap.timeline({ repeat: -1 });
  
  if (prefersReducedMotion()) {
    return timeline; // Return empty timeline if motion is reduced
  }

  // Slow wing flap cycle (3 seconds per cycle)
  // Left wing rotates up, right wing rotates down (opposite directions for natural flapping)
  timeline
    .to(leftWing, {
      rotation: 8,
      duration: 1.5,
      ease: 'power2.inOut',
    })
    .to(rightWing, {
      rotation: -8,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 0) // Start at same time
    .to(leftWing, {
      rotation: -8,
      duration: 1.5,
      ease: 'power2.inOut',
    })
    .to(rightWing, {
      rotation: 8,
      duration: 1.5,
      ease: 'power2.inOut',
    }, '<'); // Start at same time as previous

  // Subtle breathing motion for the body
  gsap.to(body, {
    y: '+=3',
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  });

  return timeline;
};

/**
 * Updates butterfly state based on scroll direction
 * Gentle, intentional movements
 */
export const updateButterflyOnScroll = (
  leftWing: SVGElement,
  rightWing: SVGElement,
  direction: number
): void => {
  if (prefersReducedMotion()) return;

  // Scroll down: wider flaps, more energy
  // Scroll up: relaxed, softer motion
  const rotation = direction === 1 ? 15 : 5;
  
  // Wings flap in opposite directions for natural motion
  gsap.to(leftWing, {
    rotation: direction === 1 ? rotation : -rotation,
    duration: 0.4,
    ease: 'power2.out',
  });
  gsap.to(rightWing, {
    rotation: direction === 1 ? -rotation : rotation,
    duration: 0.4,
    ease: 'power2.out',
  });
};

/**
 * Animates text entry with fade and rise
 */
export const animateTextEntry = (
  element: HTMLElement,
  delay: number = 0
): gsap.core.Tween => {
  if (prefersReducedMotion()) {
    return gsap.set(element, { opacity: 1, y: 0 });
  }

  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay,
      ease: 'power3.out',
    }
  );
};

/**
 * Updates butterfly color and glow based on section
 */
export const updateButterflyState = (
  butterflyElement: SVGElement,
  sectionIndex: number
): void => {
  if (prefersReducedMotion()) return;

  // Color states per section (progressing to gold)
  const colorStates = [
    { fill: '#1a1a1a', glow: 0, glowColor: '#000000' }, // Section 0: Dark/black
    { fill: '#2d2416', glow: 3, glowColor: '#8b6914' }, // Section 1: Dark gold hint
    { fill: '#4a3a1f', glow: 5, glowColor: '#b8860b' }, // Section 2: Brighter gold
    { fill: '#6b5428', glow: 8, glowColor: '#daa520' }, // Section 3: Rich gold
    { fill: '#8b6914', glow: 12, glowColor: '#ffd700' }, // Section 4: Bright gold
    { fill: '#ffd700', glow: 20, glowColor: '#ffed4e' }, // Section 5: Peak gold glow
  ];

  const state = colorStates[Math.min(sectionIndex, colorStates.length - 1)];

  // Update fill colors for wings - use gradient or solid based on section
  const wings = butterflyElement.querySelectorAll('[data-wing]');
  wings.forEach((wing) => {
    if (sectionIndex >= 4) {
      // Use gold gradient for peak sections
      gsap.to(wing, {
        attr: { fill: 'url(#goldGradient)' },
        duration: 1.5,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(wing, {
        attr: { fill: state.fill },
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }
  });

  // Update glow with gold color
  gsap.to(butterflyElement, {
    filter: `drop-shadow(0 0 ${state.glow}px ${state.glowColor}) drop-shadow(0 0 ${state.glow * 1.5}px ${state.glowColor})`,
    duration: 1.5,
    ease: 'power2.inOut',
  });
};

/**
 * Final ascent animation for section 5
 */
export const animateButterflyAscent = (
  butterflyElement: SVGElement,
  leftWing: SVGElement,
  rightWing: SVGElement
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (prefersReducedMotion()) {
    timeline.to(butterflyElement, {
      opacity: 0,
      duration: 0.01,
    });
    return timeline;
  }

  // Stop wing motion
  gsap.killTweensOf([leftWing, rightWing]);

  // Ascend and fade
  timeline
    .to(butterflyElement, {
      y: -200,
      opacity: 0,
      duration: 3,
      ease: 'power2.in',
    })
    .to([leftWing, rightWing], {
      rotation: 0,
      duration: 2,
      ease: 'power2.out',
    }, 0);

  return timeline;
};

