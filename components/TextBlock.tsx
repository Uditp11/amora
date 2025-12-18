'use client';

import { useEffect, useRef } from 'react';
import { animateTextEntry } from '@/lib/animations';
import { createTextScrollTrigger } from '@/lib/scroll';

interface TextBlockProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function TextBlock({ children, delay = 0, className = '' }: TextBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<any>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find parent section
    if (blockRef.current) {
      parentRef.current = blockRef.current.closest('section');
    }

    if (!blockRef.current || !parentRef.current) {
      return;
    }

    // Create scroll trigger for this text block
    triggerRef.current = createTextScrollTrigger(parentRef.current, () => {
      if (blockRef.current) {
        animateTextEntry(blockRef.current, delay);
      }
    });

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, [delay]);

  return (
    <div
      ref={blockRef}
      className={className}
      style={{ opacity: 0, transform: 'translateY(40px)' }}
    >
      {children}
    </div>
  );
}

