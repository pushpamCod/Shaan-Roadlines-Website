# TravelEase Design System

## Direction
Premium travel booking platform — luxury tech aesthetic. Deep navy + teal + amber. Space Grotesk display, General Sans body. Glassmorphism cards on dark hero sections. Confident and aspirational.

## Differentiation
Dark-primary hero with glassmorphism booking widget. Amber CTAs pop against navy. Teal accents signal trust and open sky.

## Palette
| Token | Light OKLCH | Dark OKLCH | Usage |
|---|---|---|---|
| background | 0.97 0.008 230 | 0.13 0.022 255 | Page base |
| foreground | 0.14 0.018 240 | 0.94 0.01 240 | Body text |
| card | 1.0 0.003 230 | 0.17 0.025 255 | Card surfaces |
| primary | 0.52 0.19 240 | 0.68 0.18 200 | CTAs, links |
| accent | 0.72 0.16 75 | 0.75 0.17 75 | Amber CTAs |
| muted | 0.93 0.012 225 | 0.22 0.03 255 | Subtle bg |

## Typography
- Display: Space Grotesk — headings, hero text, tabs
- Body: General Sans — paragraphs, labels, data
- Mono: Geist Mono — codes, prices, IDs
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, section `text-3xl md:text-5xl font-bold`, label `text-sm uppercase tracking-widest`

## Structural Zones
| Zone | Background | Border | Notes |
|---|---|---|---|
| Navbar | bg-card / glass | border-b | Sticky, glassmorphism on scroll |
| Hero | gradient-hero | none | Full-bleed dark gradient |
| Content sections | bg-background | none | Alternates with section-alt |
| Alt sections | bg-muted/30 | none | Every other section |
| Footer | bg-card | border-t | Dark elevated |

## Motion
- Entrance: `animate-slide-up` staggered at `delay: index * 0.08s`
- Cards: `card-hover` — lift + shadow on hover
- Navbar: glassmorphism activates on scroll (scrollY > 20)
- Chatbot: `animate-slide-right` from bottom-right
- Reduced motion: wrap all motion in `@media (prefers-reduced-motion: no-preference)`

## Patterns
- Glassmorphism: `.glass`, `.glass-card` on hero booking widget
- Skeleton: `.skeleton` with shimmer for all async lists
- Amber primary buttons for key CTAs (`Book Now`, `Search`, `Pay`)
- Teal primary for navigation, links, selected states
- Status badges: green Confirmed, amber Pending, red Cancelled
