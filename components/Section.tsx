'use client';

import { useEffect, useRef, forwardRef } from 'react';
import { animateTextEntry } from '@/lib/animations';
import { createTextScrollTrigger } from '@/lib/scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = '' }, ref) => {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<ScrollTrigger | null>(null);

    // Combine refs: use forwarded ref if provided, otherwise use internal ref
    const setRefs = (el: HTMLElement | null) => {
      if (sectionRef) {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      }
    };

    useEffect(() => {
      if (!textRef.current || !sectionRef.current) {
        return;
      }

      // Create scroll trigger for text animation
      triggerRef.current = createTextScrollTrigger(sectionRef.current, () => {
        if (textRef.current) {
          animateTextEntry(textRef.current);
        }
      });

      return () => {
        if (triggerRef.current) {
          triggerRef.current.kill();
        }
      };
    }, []);

    return (
      <section
        ref={setRefs}
        className={`min-h-screen flex items-center justify-center px-4 relative mb-8 ${className}`}
        style={{ zIndex: 30 }}
      >
        <div
          ref={textRef}
          className="text-center max-w-3xl mx-auto relative"
          style={{ opacity: 0, transform: 'translateY(40px)', zIndex: 31 }}
        >
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;

