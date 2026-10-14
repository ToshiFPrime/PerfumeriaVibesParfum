---
name: emil-design
description: >-
  Use this skill when designing, building, or refining user interfaces, micro-interactions,
  and animations based on Emil Kowalski's design engineering principles. Ensures UI feels
  alive, tactile, optically balanced, and far from generic or template-like.
---

# Emil Kowalski Design Engineering & Micro-Interactions Standard

This skill establishes the high-craft design engineering methodology popularized by Emil Kowalski. Every component built under this standard must feel deliberate, responsive, and tactile.

## Core Principles

### 1. Optical Alignment & Sub-pixel Hierarchy
- **Optical vs. Geometric Balance:** Geometric centers frequently appear sunken or skewed. Always compensate visually (e.g. icon + text offsets, badge alignment).
- **Proportional Radii:** Nested containers must follow $(R_{\text{inner}} = R_{\text{outer}} - \text{padding})$. Never mix discordant border radii.
- **Elevation through Light, Not Heavy Drop Shadows:** In dark mode, depth is created by lighter border highlights (`rgba(255,255,255,0.08)` to `0.15`), subtle surface luminance increases (elevated surfaces are slightly less black than base surfaces), and soft ambient blurs.

### 2. Micro-interactions & Tactile States
- **Scale on Active:** Interactive elements (buttons, perfume cards, variant selectors) should depress slightly on click (`active:scale-[0.98]` or `active:scale-[0.97]`).
- **Smooth Hover Transitions:** Use `transition-all duration-200 ease-out` or cubic-bezier spring curves. Never use abrupt, un-eased state jumps.
- **Focus Rings:** Subtle inner/outer rings with high-contrast outlines that feel integral to the design rather than default browser outlines.
- **Feedback Indicators:** Always provide instant visual acknowledgment upon user action (e.g., button transforms to a checked state or shows micro-confetti upon adding to cart).

### 3. Layout Rhythm & Deliberate Typography
- **Strict Spatial System:** Work with consistent multiples (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
- **Letter Spacing Control:** Larger display headers require tightened tracking (`tracking-tight` or `tracking-tighter`). Tiny uppercase meta labels (e.g. "EAU DE PARFUM", "NOTAS DE SALIDA") require open tracking (`tracking-widest` or `tracking-wider`).
- **Contrast Ratios:** Contrast must satisfy accessibility without being harsh. Use pure white for focal titles, silver/zinc for body text, and muted slate for metadata.

### 4. Anti-Generic Checklist
- [ ] No default blue or purple accents unless brand-driven.
- [ ] No flat, un-styled cards with harsh 1px borders without depth.
- [ ] No jumpy layout shifts during loading or state changes.
- [ ] Interactive elements have distinct `:hover`, `:active`, and `:disabled` states.
- [ ] Mobile interactions feature thumb-friendly touch targets (min 44px height).
