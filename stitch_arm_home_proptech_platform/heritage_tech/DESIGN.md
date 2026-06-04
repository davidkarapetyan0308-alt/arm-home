---
name: Heritage Tech
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#44474c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#a93700'
  on-secondary: '#ffffff'
  secondary-container: '#fd6b31'
  on-secondary-container: '#5c1a00'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca830'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59b'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#812800'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  slate-deep: '#1A2B3C'
  tuff-terracotta: '#C04000'
  heritage-gold: '#D4AF37'
  surface-light: '#FFFFFF'
  surface-dark: '#0A0C10'
  glass-border: rgba(255, 255, 255, 0.12)
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is a "Premium Minimalist" framework tailored for the Armenian real estate market. It fuses high-tech utility with cultural resonance. The brand personality is **Trustworthy, Sophisticated, and Transparent**. 

The visual style draws heavily from **Apple-style Minimalism**, prioritizing clarity and generous whitespace to reduce cognitive load during the high-stakes process of property searching. To differentiate from standard corporate SaaS, it incorporates **Glassmorphism** for navigational overlays and **Subtle Tactility** to evoke the permanence of real estate. The aesthetic is clean and precise, using high-quality typography and a restricted color palette to signal a premium, concierge-level experience.

## Colors

The palette is anchored by **Slate Deep (#1A2B3C)**, providing a foundation of institutional trust. The primary accent is **Tuff Terracotta (#C04000)**, a nod to Armenia's architectural identity, used sparingly for primary actions and key highlights.

### Color Application
- **Primary:** Use Slate Deep for text headers, primary icons, and structural elements.
- **Accent:** Use Tuff Terracotta for CTA buttons and "New" listing badges. 
- **Heritage Gold:** Reserved for premium "verified" statuses and luxury tier property labels.
- **Light Mode:** Uses a near-white background (#F9F9F9) with pure white surfaces for cards.
- **Dark Mode:** Transitions to a deep charcoal-black (#0A0C10) with translucent Slate Deep overlays.

## Typography

This design system utilizes **Inter** exclusively to achieve a systematic, neutral, and highly legible interface. The typographic hierarchy relies on weight and tight letter-spacing in headlines to create a "Swiss" editorial feel.

- **Headlines:** Use SemiBold (600) weights with slight negative tracking to give the brand a modern, "Apple-esque" authority.
- **Body:** Standardized at 16px for optimal readability across property descriptions.
- **Labels:** Small caps or medium weights are used for metadata (e.g., Sqm, Price/m²) to distinguish data from narrative text.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px max-width container on desktop, centered with generous margins to evoke a sense of luxury and focus.

- **Grid:** A 12-column grid on desktop, 8-column on tablet, and 4-column on mobile.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **Whitespace:** Use "oversized" padding (min 40px) between major sections to emphasize the minimalist aesthetic. Avoid crowded property grids; allow listings "room to breathe."

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Glassmorphism** rather than heavy drop shadows.

- **Surface Levels:** The base background is the lowest level. Cards and content containers sit on the next level with a subtle 1px border (#E5E5E5) and a very soft, diffused shadow (Blur 20px, 4% Opacity).
- **Glassmorphism:** Navigation bars, search filters, and modal backdrops must use a backdrop-blur (20px) with a semi-transparent surface (White @ 70% or Slate @ 80% for dark mode).
- **Interaction:** On hover, cards should subtly lift using a slightly more pronounced shadow and a 1% scale increase.

## Shapes

The shape language is consistently **Rounded**, conveying friendliness and modern tech-forwardness. 

- **Cards & Modals:** Use a 16px (`rounded-lg`) corner radius as the standard.
- **Buttons:** Use 12px or fully pill-shaped (rounded-full) corners for primary actions to make them feel "squishy" and tappable on mobile.
- **Inputs:** Use an 8px radius to maintain a slightly more structured look for data entry.

## Components

### Buttons
- **Primary:** Tuff Terracotta background, White text. High contrast, 16px height-padding.
- **Secondary:** Transparent background, Slate Deep border (1px), Slate Deep text.
- **Ghost:** No border, Slate Deep text. Used for less frequent actions.

### Cards (Property Listings)
- Images should feature a 16px top-radius. 
- Content area below the image uses a white background with a subtle "inner glow" border. 
- Price is always displayed in `headline-md` weight.

### Input Fields
- Subtle grey background (#F1F1F1) with no initial border. 
- Transition to a Slate Deep 2px border on focus. 
- Placeholder text in light grey.

### Chips & Badges
- Used for property features (e.g., "Balcony", "Renovated"). 
- Small 4px radius, low-saturation Slate background, and `label-sm` typography.

### Search Bar
- Floating glassmorphic element with a high backdrop blur. 
- Always stays pinned or easily accessible to reinforce the "Tool-first" nature of the app.