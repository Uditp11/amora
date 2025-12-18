'use client';

import { useEffect, useState, useRef } from 'react';
import Butterfly from '@/components/Butterfly';
import Section from '@/components/Section';
import Sparkles from '@/components/Sparkles';
import TextBlock from '@/components/TextBlock';
import { createSectionTrigger, cleanupScrollTriggers } from '@/lib/scroll';
import { animateTextEntry } from '@/lib/animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showFinalText, setShowFinalText] = useState(false);
  // Initialize butterfly position to center of viewport (where it will be)
  const [butterflyX, setButterflyX] = useState(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const [butterflyY, setButterflyY] = useState(typeof window !== 'undefined' ? window.innerHeight * 0.45 : 0);
  const sectionRefs = useRef<(HTMLElement | null)[]>(new Array(7).fill(null));
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const finalTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Setup section tracking after a brief delay to ensure refs are set
    const timer = setTimeout(() => {
      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const trigger = createSectionTrigger(section, index, (idx) => {
            setCurrentSection(idx);
          });
          triggersRef.current.push(trigger);
        }
      });
    }, 200); // Increased delay to ensure all refs are set

    return () => {
      clearTimeout(timer);
      cleanupScrollTriggers();
      triggersRef.current = [];
    };
  }, []);

  // Show final text after butterfly begins ascent (section 6, index 6)
  useEffect(() => {
    if (currentSection === 6 && !showFinalText) {
      // Delay text appearance to happen after butterfly starts ascending
      const timer = setTimeout(() => {
        setShowFinalText(true);
        // Animate text entry with a small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          if (finalTextRef.current) {
            animateTextEntry(finalTextRef.current, 0.5);
          }
        });
      }, 800); // 800ms after section 6 is reached to ensure butterfly has started ascending

      return () => clearTimeout(timer);
    }
  }, [currentSection, showFinalText]);

  const handleAscentComplete = () => {
    // Butterfly has completed its ascent
    // This can be used for any final animations if needed
  };

  // Calculate sparkle intensity based on section (0-1)
  // Always emit sparkles, but intensity controls brightness and frequency
  // Now we have 6 sections (0-5), so divide by 5
  const sparkleIntensity = Math.min(currentSection / 5, 1);

  return (
    <main className="relative">
      <Sparkles 
        butterflyX={butterflyX} 
        butterflyY={butterflyY} 
        intensity={sparkleIntensity} 
      />
      <Butterfly 
        currentSection={currentSection} 
        onAscentComplete={handleAscentComplete}
        onPositionUpdate={(x, y) => {
          setButterflyX(x);
          setButterflyY(y);
        }}
      />

      {/* Section 0: Landing */}
      <Section ref={(el) => { sectionRefs.current[0] = el; }}>
        <div className="w-full">
          <TextBlock>
            <h1 className="font-serif text-6xl md:text-8xl mb-12 text-white" style={{ lineHeight: '1.6', fontWeight: 500 }}>
              Hi.
            </h1>
          </TextBlock>
          <TextBlock delay={1.2}>
            <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
              This is something I made
              <br />
              because words alone didn't feel enough.
            </p>
          </TextBlock>
          <TextBlock delay={2.0}>
            <p className="font-sans text-base md:text-lg text-yellow-200/80 mt-12" style={{ lineHeight: '1.7', fontWeight: 400 }}>
              Scroll gently.
            </p>
          </TextBlock>
        </div>
      </Section>

      {/* Section 1: Before You */}
      <Section ref={(el) => { sectionRefs.current[1] = el; }}>
        <div className="w-full">
          <p className="font-serif text-3xl md:text-5xl mb-8 text-white" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            Before you,
            <br />
            I was doing fine.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            Life was moving forward.
            <br />
            Days had structure.
            <br />
            Plans made sense.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            But something was missing,
            <br />
            not loudly,
            <br />
            just quietly.
          </p>
          <p className="font-serif text-2xl md:text-4xl text-white mt-12" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            Like knowing how to walk
            <br />
            without knowing how to float.
          </p>
        </div>
      </Section>

      {/* Section 2: Finding You - with Image */}
      <Section ref={(el) => { sectionRefs.current[2] = el; }}>
        <div className="w-full">
          <p className="font-serif text-2xl md:text-4xl mb-8 text-white" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            With you,
            <br />
            nothing felt forced.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            Conversations didn't need effort.
            <br />
            Silence didn't need filling.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            Somewhere between talks that went on longer than planned
            <br />
            and moments where neither of us rushed to say anything,
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            you stopped being just someone I spoke to
            <br />
            and became someone I felt calm around.
          </p>
          <p className="font-serif text-xl md:text-3xl text-white mt-12" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            That was new for me.
            <br />
            And it stayed.
          </p>
          
          {/* Image with Text Overlay */}
          <div className="mt-16 w-full relative">
            <div className="relative w-full overflow-hidden" style={{ minHeight: '60vh' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/10 blur-3xl"></div>
              <img 
                src="/IMG_20251123_181034.jpg" 
                alt="Majhi Phulpakhro"
                className="w-full h-full object-cover"
                style={{
                  filter: 'brightness(0.4) contrast(1.1)',
                }}
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl">
                  <p className="font-serif text-3xl md:text-5xl mb-6 text-white" style={{
                    textShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}>
                    This is how I see you.
                  </p>
                  <p className="font-serif text-2xl md:text-4xl mb-4 text-yellow-200" style={{
                    textShadow: '0 0 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.6)',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}>
                    Free.
                  </p>
                  <p className="font-serif text-2xl md:text-4xl mb-4 text-yellow-200" style={{
                    textShadow: '0 0 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.6)',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}>
                    Unafraid of the moment.
                  </p>
                  <p className="font-serif text-2xl md:text-4xl mb-4 text-yellow-200" style={{
                    textShadow: '0 0 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.6)',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}>
                    Completely yourself.
                  </p>
                  <p className="font-sans text-xl md:text-2xl text-yellow-300 mt-8" style={{
                    textShadow: '0 0 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.6)',
                    lineHeight: '1.7',
                    fontWeight: 400
                  }}>
                    You don't wait for permission
                    <br />
                    to feel joy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Why You */}
      <Section ref={(el) => { sectionRefs.current[3] = el; }}>
        <div className="w-full">
          <p className="font-serif text-3xl md:text-5xl mb-8 text-white" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            I admire you for things
            <br />
            you don't even notice about yourself.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            For the way you carry responsibility
            <br />
            without letting it harden you.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-6" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            For how you stay thoughtful
            <br />
            even when you're tired.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-6" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            For how you feel deeply
            <br />
            and still choose grace over bitterness.
          </p>
          <p className="font-serif text-2xl md:text-4xl text-white mt-12" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            You're strong —
            <br />
            not the loud kind,
            <br />
            but the steady kind that lasts.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-12" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            Being around you doesn't excite my chaos.
            <br />
            It calms it.
          </p>
        </div>
      </Section>

      {/* Section 4: My Promise */}
      <Section ref={(el) => { sectionRefs.current[4] = el; }}>
        <div className="w-full">
          <p className="font-serif text-3xl md:text-5xl mb-8 text-white" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            Love doesn't fade
            <br />
            when it is understood.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            And I don't choose you
            <br />
            only when things are easy,
            <br />
            or smooth,
            <br />
            or beautiful.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-8" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            I choose you
            <br />
            when things take time.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-6" style={{ lineHeight: '1.7', fontWeight: 400 }}>
            When patience is needed.
            <br />
            When growth is slow.
            <br />
            When life asks us to become better than we were yesterday.
          </p>
          <p className="font-serif text-2xl md:text-4xl text-white mt-12" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            That choice doesn't exhaust me.
            <br />
            It grounds me.
          </p>
          <p className="font-serif text-3xl md:text-5xl text-white mt-12" style={{ lineHeight: '1.6', fontWeight: 500 }}>
            Always.
          </p>
        </div>
      </Section>

      {/* Section 5: Final */}
      <Section ref={(el) => { sectionRefs.current[5] = el; }}>
        <div className="w-full">
          <p className="font-serif text-2xl md:text-4xl mb-8 text-white" style={{ lineHeight: '1.6' }}>
            This website will end here.
          </p>
          <p className="font-serif text-2xl md:text-4xl mb-8 text-white mt-8" style={{ lineHeight: '1.6' }}>
            What I feel for you doesn't.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-12" style={{ lineHeight: '1.7' }}>
            If love had a form,
            <br />
            it wouldn't try to impress.
          </p>
          <p className="font-sans text-lg md:text-xl text-yellow-200/90 mt-6" style={{ lineHeight: '1.7' }}>
            It would be gentle.
            <br />
            It would be real.
            <br />
            It would feel like home.
          </p>
        </div>
      </Section>

      {/* Section 6: Majhi Phulpakhro - Final Line */}
      <Section ref={(el) => { sectionRefs.current[6] = el; }}>
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
          <p
            ref={finalTextRef}
            className="font-serif text-6xl md:text-9xl text-yellow-300 tracking-wider text-center"
            style={{ 
              opacity: 0, 
              transform: 'translateY(40px)',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.6), 0 0 90px rgba(255, 215, 0, 0.4)',
              letterSpacing: '0.1em',
              lineHeight: '1.6',
              fontWeight: 500
            }}
          >
            Majhi Phulpakhro
          </p>
        </div>
      </Section>
    </main>
  );
}

