# Implementation Notes

## Animation Timelines

### Butterfly Idle Animation
- **Duration**: 3 seconds per cycle (1.5s up, 1.5s down)
- **Wing Motion**: Left and right wings rotate in opposite directions for natural flapping
- **Breathing Motion**: Body gently moves up/down with 2-second cycles
- **Easing**: `power2.inOut` for smooth, organic movement

### Scroll-Based Butterfly Response
- **Trigger**: ScrollTrigger.onUpdate detects scroll direction
- **Scroll Down**: Wings flap wider (15° rotation), indicating energy/engagement
- **Scroll Up**: Wings relax (5° rotation), indicating calm/rest
- **Duration**: 0.4s transitions for responsive feel

### Section-Based Butterfly States
Each section triggers a color and glow transition:
- **Section 0**: Dark tones (#1e293b), no glow - gentle beginning
- **Section 1**: Warm tones (#3b2f5f), subtle glow (2px) - awakening
- **Section 2**: Brighter (#5b21b6), medium glow (4px) - discovery
- **Section 3**: Full color (#7c3aed), strong glow (6px) - celebration
- **Section 4**: Mature tones (#8b5cf6), calm glow (5px) - stability
- **Section 5**: Lightest (#a78bfa), brightest glow (8px) - ascension

### Text Entry Animation
- **Initial State**: opacity: 0, y: 40px
- **Final State**: opacity: 1, y: 0
- **Duration**: 1.2s with `power3.out` easing
- **Trigger**: ScrollTrigger at "top 70%" viewport position
- **Once**: true (animates only once per section)

### Final Section Ascent
- **Butterfly Movement**: Moves upward 200px over 3 seconds
- **Fade**: Opacity transitions from 1 to 0
- **Wing Motion**: Stops and returns to neutral (0° rotation) over 2 seconds
- **Text Timing**: Final text "Majhi Phulpakhro." appears 500ms after butterfly begins ascent

## Assumptions Made

1. **Viewport Height**: Each section is exactly 100vh, assuming standard viewport behavior
2. **Scroll Behavior**: Smooth scrolling is enabled via CSS, but respects `prefers-reduced-motion`
3. **Color Progression**: Butterfly colors progress from dark to light, representing emotional journey
4. **Timing**: 500ms delay for final text ensures butterfly ascent is visible before text appears
5. **Accessibility**: All animations respect `prefers-reduced-motion` media query
6. **Mobile**: Tailwind responsive classes handle mobile-first design (text sizes scale down)

## Technical Decisions

1. **No requestAnimationFrame**: All animations use GSAP timelines for better performance and control
2. **Inline SVG**: Butterfly is inline SVG (not canvas) for better scalability and CSS control
3. **Fixed Position**: Butterfly uses `position: fixed` to remain visible during scroll
4. **Transform Origin**: Wing rotations use explicit transform-origin for natural pivot points
5. **Cleanup**: All ScrollTriggers are properly cleaned up on component unmount to prevent memory leaks

## Performance Considerations

- ScrollTrigger instances are created once and reused
- Animations use GPU-accelerated properties (transform, opacity)
- Reduced motion preference disables all animations immediately
- No layout shifts: all dimensions are fixed or calculated upfront

