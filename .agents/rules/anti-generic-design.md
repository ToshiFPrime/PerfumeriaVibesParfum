# Anti-Generic Design & Interaction Engineering Rules

All components, pages, and interactive elements in **Vibes Parfum** must adhere to the following standards:

1. **No Generic Cookie-Cutter Templates**:
   - Never use standard, flat bootstrap-like cards with harsh grey borders.
   - Use multi-layered dark backgrounds (Onyx `#09090b` -> Charcoal `#121215` -> Graphite `#1c1c21`).
   - Use delicate, semi-transparent borders (`border-white/10` or `border-zinc-800`).

2. **Tactile Micro-interactions (Emil Kowalski Standard)**:
   - Interactive elements must scale slightly when clicked (`active:scale-[0.98]`).
   - Smooth transitions (`transition-all duration-200 ease-out`).
   - Interactive variant pills for milliliters (5ml, 10ml, 50ml, 100ml) with immediate tactile feedback.

3. **Luxury Palette Compliance (Negro, Plomo, Blanco)**:
   - Dominant colors: Deep obsidian black, graphite/plomo slates, crisp white.
   - Accents: Metallic chrome and WhatsApp emerald for conversion buttons.

4. **Multi-device Responsiveness**:
   - Mobile: Touch targets >= 44px, sticky order bars, bottom-accessible navigation.
   - Desktop: Multi-column filter sidebar, hover micro-interactions, expansive image galleries.
