import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

/**
 * Scroll utilities and ScrollTrigger setup
 */

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Creates a scroll trigger for text entry animation
 */
export const createTextScrollTrigger = (
  element: HTMLElement,
  onEnter: () => void
): ScrollTrigger => {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 70%',
    once: true,
    onEnter,
  });
};

/**
 * Creates a scroll trigger to track section changes
 */
export const createSectionTrigger = (
  section: HTMLElement,
  index: number,
  onEnter: (index: number) => void
): ScrollTrigger => {
  return ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => onEnter(index),
    onEnterBack: () => onEnter(index),
  });
};

/**
 * Cleans up all ScrollTrigger instances
 */
export const cleanupScrollTriggers = (): void => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

