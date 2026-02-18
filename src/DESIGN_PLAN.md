# Blogify Design System 2.0: "Nebula Editorial"

## 1. Design Philosophy
Moving away from generic "Bootstrap/Material" looks to a **Modern, Content-First, Digital Magazine** aesthetic. The goal is to make the reader feel like they are entering a premium space.

**Keywords**: Immersive, Depth, fluidity, Typography-driven.

## 2. Typography
Typography is 90% of web design. We will move to a pairing that suggests authority and modernity.

*   **Headings**: **'Outfit'** (Space-grotesk vibe) or **'Playfair Display'** (if we want classic).
    *   *Decision*: **'Outfit'**. It's geometric, modern, and high-energy.
*   **Body**: **'Inter'** or **'Satoshi'**.
    *   *Decision*: **'Inter'** for unmatched readability.

## 3. Color Palette (Dark Mode First)
We will adopt a "Deep Space" theme.

*   **Background**: `#030712` (Gray 950 - almost black, but richer)
*   **Surface**: `#0f172a` (Slate 900 - blue undertone) with `backdrop-blur`
*   **Primary Accent**: `#6366f1` (Indigo 500) to `#a855f7` (Purple 500) gradient.
*   **Text**:
    *   Primary: `#f8fafc` (Slate 50)
    *   Secondary: `#94a3b8` (Slate 400)

## 4. UI Elements & Components

### A. The "Glass" Stack
Instead of flat cards, we use layers of glass.
*   **Card Base**: `bg-slate-900/50` + `backdrop-blur-xl` + `border-white/5`
*   **Hover**: `border-indigo-500/30` + `shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]`

### B. The "Bento" Grid
*   The Homepage will move away from a simple list to a **Bento Grid** layout.
*   Featured post takes 2x2.
*   Recent posts take 1x1.
*   Newsletter takes 2x1.

### C. Buttons
*   **Primary**: Gradient background, rounded-full, "inner glow" effect.
*   **Secondary**: Border-only, white/10, hover white/20.

## 5. Implementation Roadmap

1.  **Foundation**:
    *   Update `index.css` with new CSS variables and Font imports.
    *   Add "Noise" texture overlay for film-grain effect.

2.  **Layout Structure**:
    *   **Header**: Floating "Island" navigation (detached from top).
    *   **Footer**: Massive typographic footer.

3.  **Page Redesigns**:
    *   **Home**: Implement Bento Grid. Hero section with "text masking" or "glowing orbs".
    *   **Post Details**: minimalist "Reader Mode" focus.

## 6. CSS Variable Definitions (Preview)

```css
:root {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  
  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;
  
  --popover: 224 71% 4%;
  --popover-foreground: 215 20.2% 65.1%;
  
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
  
  --secondary: 222.2 47.4% 11.2%;
  --secondary-foreground: 210 40% 98%;
  
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 262.1 83.3% 57.8%;
  
  --radius: 1rem;
}
```
