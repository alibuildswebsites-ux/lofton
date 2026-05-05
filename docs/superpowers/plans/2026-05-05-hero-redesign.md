# "Living Narrative" Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the static Hero section into a cinematic experience with a background video and premium animations.

**Architecture:** 
- Add a background video container with a darkened overlay for readability.
- Refine existing Framer Motion entrance animations.
- Integrate GSAP ScrollTrigger for a subtle parallax/zoom effect on the background video during scroll.

**Tech Stack:** React, Tailwind CSS, Framer Motion, GSAP, Lucide React.

---

### Task 1: Background Video Integration

**Files:**
- Modify: `/root/lofton/components/Hero.tsx`

- [ ] **Step 1: Add Video Background Structure**
Update the `Hero` component to include a video background container.

```tsx
// Insert before the main content div in Hero.tsx
<div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
    poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
  >
    <source 
      src="https://player.vimeo.com/external/371433846.sd.mp4?s=231514893e374ceaf11fcf53397b55d14013470&profile_id=139&oauth2_token_id=57447761" 
      type="video/mp4" 
    />
    Your browser does not support the video tag.
  </video>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50 z-10" />
</div>
```

- [ ] **Step 2: Update Section Styles**
Change the section background from `bg-background` to `bg-black` and ensure relative positioning for layering.

- [ ] **Step 3: Update Text Colors**
Ensure all text and badges are readable against the dark background (e.g., change `text-foreground` to `text-white` or equivalent).

- [ ] **Step 4: Commit**
```bash
git add /root/lofton/components/Hero.tsx
git commit -m "feat: add video background to hero section"
```

---

### Task 2: Refine Entrance Animations

**Files:**
- Modify: `/root/lofton/components/Hero.tsx`

- [ ] **Step 1: Enhance Item Variants**
Update `itemVariants` to use a more dramatic entrance (e.g., larger y-offset and longer duration).

```tsx
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};
```

- [ ] **Step 2: Split Headline for Animation**
Wrap the headline text in separate `motion.span` elements or simply use `<br />` with staggered children if already using `staggerChildren`.

- [ ] **Step 3: Commit**
```bash
git add /root/lofton/components/Hero.tsx
git commit -m "style: refine hero entrance animations"
```

---

### Task 3: GSAP Parallax Scroll Effect

**Files:**
- Modify: `/root/lofton/components/Hero.tsx`

- [ ] **Step 1: Import GSAP and ScrollTrigger**
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

- [ ] **Step 2: Implement Parallax Zoom**
Use a `ref` for the video container and implement a GSAP animation that scales the video as the user scrolls.

```tsx
const videoRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!videoRef.current) return;

  gsap.to(videoRef.current, {
    scale: 1.1,
    y: '20%',
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}, []);
```

- [ ] **Step 3: Commit**
```bash
git add /root/lofton/components/Hero.tsx
git commit -m "feat: add GSAP parallax zoom to hero background"
```

---

### Task 4: Verification

- [ ] **Step 1: Run Lint and Build**
Run: `npm run lint && npm run build`
Expected: SUCCESS

- [ ] **Step 2: Visual Inspection (Manual)**
The developer should verify the video plays, the overlay provides enough contrast, and the parallax effect is smooth.
