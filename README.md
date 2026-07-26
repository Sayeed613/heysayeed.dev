# heysayeed.dev

A personal developer portfolio styled as a live VS Code session. Every UI element reinforces the code editor metaphor — from the chrome bar with tick ruler and live clock, to the drag-interactive subheading with custom cursors.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build | Vite 8 |
| CSS | Tailwind v4 |
| Entrance animations | GSAP 3 |
| Physics / drag / cursor | Framer Motion 12 |
| Layout | Lenis (installed) |
| Fonts | Space Grotesk (display), JetBrains Mono (chrome), Inter (body) |

## Project Structure

```
src/
├── App.tsx                        # Root — GSAP entrance timeline + layout
├── main.tsx                       # React entry point
├── index.css                      # Design tokens + global styles + keyframes
├── components/
│   ├── ChromeBar.tsx              # Fixed top bar: logo, tick ruler, scroll %, clock, build status
│   ├── FloatingNav.tsx            # Center-pill nav with layoutId active pill animation
│   ├── HeadlineAnim.tsx           # Staggered spring headline reveal with blinking cursor
│   ├── SubheadingAnim.tsx         # Draggable subheading with selection border + "do not drag" badge
│   ├── BackgroundGrid.tsx         # Fixed animated dot grid background
│   ├── SyntaxTokens.tsx           # Floating syntax highlight tokens with magnet effect
│   ├── VisitorCursor.tsx          # Custom macOS-style "You" cursor (blue triangle + badge)
│   └── SayeedCursor.tsx           # Second "Sayeed" cursor (orange badge + sarcastic speech bubble)
public/
├── logo.png                       # Brand logo mark
├── favicon.svg                    # Favicon
└── icons.svg                      # SVG icons
```

## Key Features

### 🖥️ VS Code Chrome
- **ChromeBar**: 36px fixed top bar with logo, tick ruler (major + minor ticks), scroll progress indicator (blue cursor line + percentage), scanner bars, live HH:MM:SS clock, and build status pill with pulsing green dot
- **FloatingNav**: Centered pill navigation with Framer Motion `layoutId` animated active indicator, text roll-up hover effect, and separate Contact CTA pill

### 🎯 Hero Section
- **Badge**: "building in public — 2026" with floating animation
- **Headline**: "Ship fast. Break nothing." — each word springs in with stagger, blinking cursor, hover brightness/scale, accent word in cyan
- **Subheading**: Draggable subtext inside a selection border with resize handle squares. Drag triggers Sayeed intervention — a custom cursor flies in from the navbar, grabs the component, and springs it back with a sarcastic message bubble
- **CTAs**: "See the work" (orange) and "Book a call" (outlined) with background sweep animation on hover

### 🖱️ Custom Cursors
- **Visitor Cursor**: Blue triangle cursor with "You" badge, spring physics, replaces native cursor globally
- **Sayeed Cursor**: White triangle with orange "Sayeed" badge, flies from the navbar to intervene during drag, displays random sarcastic speech bubble

### ✨ Background
- **Dot Grid**: Fixed cyan dot grid at 35% opacity with subtle drift animation
- **Syntax Tokens**: ~63 floating colored shapes (cyan diamonds, indigo circles, orange rects, green dots, purple diamonds) at 65% opacity, drifting upward with magnet pull toward the mouse cursor

### 🎬 Entrance Animations
- GSAP master timeline: chrome bar → nav → badge → headline → subtext → CTAs → corner micro-copy
- Continuous float animations on CTAs and corner text (sine.inOut, staggered)

## Design Tokens

Defined in `index.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-editor-bg` | `#0B0E14` | Page background |
| `--color-editor-surface` | `#1B2A44` | Elevated surfaces |
| `--color-accent` | `#22D3EE` | Cyan — primary accent |
| `--color-accent-secondary` | `#818CF8` | Indigo — secondary accent |
| `--color-text-primary` | `#E6E6E6` | Primary text |
| `--color-text-muted` | `#6B7280` | Muted/chrome text |
| `--color-border-subtle` | `rgba(255,255,255,0.12)` | Borders |

## Getting Started

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Notes

- All GSAP entrance animations live in `App.tsx` useEffect
- Drag chip uses Framer Motion `drag` prop + `useMotionValue` for position tracking
- Sayeed's position is shared via `useMotionValue` between `App.tsx` and `SayeedCursor.tsx`
- The logo path `/logo.png` resolves from the `public/` folder
