# Design Doc: Lofton Hero Section Refinement with Infinite Grid

**Topic:** Refine and improve the Lofton hero section by integrating an interactive "Infinite Grid" background.

## 1. Goal
Integrate a tech-forward, interactive "Infinite Grid" background into the existing Lofton real estate hero section while maintaining the professional brand identity and "Subtle Sophistication" aesthetic.

## 2. Architecture
- **Layered Structure:**
    - **Background Layer:** `InfiniteGridBackground` component using SVG patterns and Framer Motion for infinite scrolling and mouse-following reveal.
    - **Gradient Layer:** Dynamic "glow blobs" using brand colors for depth.
    - **Content Layer:** The existing Lofton Hero UI, updated with Framer Motion animations for a cohesive feel.
- **Component Pattern:** Decouple the background logic into a reusable `InfiniteGrid` component in `@/components/ui`.

## 3. Tech Stack
- **Framework:** React (Vite-based)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (`motion/react`)
- **UI Components:** shadcn/ui (initialized for `cn` utility and structure)
- **Language:** TypeScript

## 4. Components & Styles
### 4.1 `InfiniteGrid` Component
- **Properties:**
    - `gridColor`: Defaults to Lofton brand green (`#4ADE80`) with low opacity.
    - `maskColor`: Radial gradient following mouse cursor.
    - `infiniteScroll`: Continuous animation using `useAnimationFrame`.
- **Logic:** SVG pattern with `motion.pattern` for smooth translation.

### 4.2 Updated `Hero` Section
- **Typography:** Retain `clamp` sizing but add `motion` for entrance animations.
- **Brand Colors:**
    - Primary: `#4ADE80` (Brand Green)
    - Charcoal: `#1F2937`
- **Animations:** Staggered entrance for all elements (Badge -> Headline -> Subheadline -> Description -> Buttons).

## 5. Implementation Strategy
1. Initialize shadcn UI.
2. Create `lib/utils.ts` with the `cn` helper.
3. Install `framer-motion` (already in `package.json`, ensure latest patterns).
4. Implement `components/ui/infinite-grid.tsx`.
5. Refactor `components/Hero.tsx` to integrate the background and animations.

## 6. Success Criteria
- The background is interactive but doesn't distract from the primary real estate CTA.
- No layout shifts during load.
- Performance remains high (60fps+ animations).
- The design feels "premium" and "tech-enabled".
