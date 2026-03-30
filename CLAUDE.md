# Architecture of Awakening — Interactive 3D Experience

## Project Overview
A professional React + Three.js immersive web application demonstrating "The Architecture of Awakening" — a four-domain reconstruction of the Buddha's path to liberation. Built for Lumiere.

## Tech Stack
- **Framework:** React 18 + Vite
- **3D Engine:** Three.js via @react-three/fiber + @react-three/drei
- **Post-processing:** @react-three/postprocessing
- **Styling:** CSS Modules + CSS custom properties
- **Fonts:** Cormorant Garamond (headings), Inter (body)

## Architecture
```
app/src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root component, section orchestration
├── index.css                   # Global styles, CSS variables, typography
├── components/
│   ├── layout/
│   │   ├── Navigation.jsx      # Fixed nav with section indicators
│   │   └── SectionWrapper.jsx  # Scroll-aware section container
│   ├── three/
│   │   ├── BrahmaviharaScene.jsx  # Four-domain 3D heart visualization
│   │   ├── JhanaProgression.jsx   # Jhana stages 3D progression
│   │   ├── ConsciousnessField.jsx # V/V₀ potential field visualization
│   │   ├── UnifiedField.jsx       # Final unified liberation state
│   │   └── ParticleField.jsx      # Reusable particle system
│   └── ui/
│       ├── Hero.jsx            # Landing hero with ambient 3D
│       ├── DomainCard.jsx      # Brahmavihara info card
│       ├── PhaseTimeline.jsx   # Practice phases vertical timeline
│       └── TheorySection.jsx   # V/V₀ theory explainer
├── data/
│   ├── brahmavihara.js         # Four domains data
│   ├── jhanas.js               # Jhana stages data
│   └── theory.js               # V/V₀ consciousness theory data
├── hooks/
│   └── useScrollProgress.js    # Scroll-linked animation hook
└── styles/
    └── theme.js                # Design tokens
```

## Content Source
Three PDF documents in the repo root:
1. **THE ARCHITECTURE OF AWAKENING.pdf** — Core four-domain framework
2. **EnlightenmentNow.pdf** — Simplified practice guide
3. **The Universe Has an Inside.pdf** — V/V₀ consciousness theory

## Key Concepts Visualized
- **Four Brahmavihāras:** Mettā (golden, outward), Muditā (sparkling, upward), Karuṇā (warm, downward-returning), Upekkhā (cool, containing sphere)
- **Four Jhānas:** Progressive stabilization mapped to each brahmavihāra
- **V/V₀ Theory:** Dual-aspect potential fields — physical exterior (V) and experiential interior (V₀)
- **Unified Liberation:** All four domains fused into boundless awareness

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Design Principles
- Dark, immersive aesthetic with luminous accents
- Scroll-driven 3D transitions
- Professional typography hierarchy
- Accessible color contrasts on all text
- Mobile-responsive layout
