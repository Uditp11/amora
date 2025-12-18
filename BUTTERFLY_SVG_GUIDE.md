# Using External Butterfly SVG

The Butterfly component supports importing an external SVG file for a custom butterfly design.

## How to Use

1. **Place your SVG file** in the `public` folder (e.g., `public/butterfly.svg`)

2. **Your SVG must have these attributes** for animations to work:
   - Left wing: `data-wing="left"` or class `left-wing`
   - Right wing: `data-wing="right"` or class `right-wing`
   - Body: `data-body` or class `body`

3. **Example SVG structure:**
```svg
<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Your gradients and filters -->
  </defs>
  
  <path data-wing="left" d="..." />
  <path data-wing="right" d="..." />
  <ellipse data-body cx="100" cy="90" rx="6" ry="35" />
</svg>
```

4. **Pass the path to the Butterfly component:**
```tsx
<Butterfly 
  currentSection={currentSection}
  externalSvgPath="/butterfly.svg"
/>
```

## Important Notes

- The external SVG will be positioned and animated the same way as the default butterfly
- Wing elements must have `transform-origin` set appropriately for rotation
- Colors will be updated via GSAP animations based on section
- If the external SVG fails to load, it will fall back to the default majestic butterfly

## Default Butterfly

If no external SVG is provided, a beautiful default gold butterfly with decorative patterns is used.

