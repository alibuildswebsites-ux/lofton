# Design Spec: "Living Narrative" Hero Redesign
Date: 2026-05-05

## 1. Objective
Transform the currently empty Hero section of the Lofton Realty homepage into a premium, cinematic experience. The goal is to establish a luxury brand identity immediately upon page load.

## 2. Visual Design
- **Background:** High-quality cinematic video loop of luxury real estate or architectural details.
- **Overlay:** Subtle dark gradient to ensure white text remains legible across all video frames.
- **Typography:**
    - **Primary Heading:** Large, elegant font (matching existing brand), split-line entrance.
    - **Sub-heading:** Refined text providing context/value proposition.
- **CTAs:** Two distinct buttons:
    - Primary: "Explore Properties" (High contrast).
    - Secondary: "Meet the Team" or "Our Services" (Outlined/Ghost style).

## 3. Technical Implementation
- **Component:** `/root/lofton/components/Hero.tsx`
- **Video Source:** Implementation will use a high-quality placeholder URL initially.
- **Animation Framework:** GSAP (GreenSock) for entrance and scroll-based parallax.
- **Smooth Scrolling:** Integration with existing Lenis setup.
- **Responsiveness:** Ensure video and text scale correctly for mobile, tablet, and desktop.

## 4. Animation Details
- **Entrance:**
    - Text: `y: 60`, `opacity: 0`, `stagger: 0.15`, `ease: "power4.out"`.
    - Buttons: Fade in with a slight delay after text.
- **Scroll:**
    - Background video: Slow parallax scaling (zoom in/out) tied to scroll position using GSAP ScrollTrigger.

## 5. Success Criteria
- Zero layout shift during video load.
- Maintained high performance (verified via Speed Insights).
- Seamless transition from loading state to hero reveal.
