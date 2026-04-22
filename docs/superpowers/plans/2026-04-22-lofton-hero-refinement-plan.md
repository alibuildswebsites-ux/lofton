# Lofton Hero Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the "Infinite Grid" background into the Lofton Hero section with shadcn/ui setup.

**Architecture:** Initialize shadcn structure, create a reusable `InfiniteGrid` component, and update the `Hero` component with Framer Motion animations.

**Tech Stack:** React, Tailwind CSS, Framer Motion (`motion/react`), shadcn/ui.

---

### Task 1: Setup Shadcn and Utils

**Files:**
- Create: `lib/utils.ts`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Create `lib/utils.ts`**
Create the `cn` utility helper.
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Install dependencies**
Install `clsx` and `tailwind-merge`.
Run: `npm install clsx tailwind-merge`

- [ ] **Step 3: Update `tailwind.config.js`**
Ensure the config includes the `lib` directory. (Already checked, it does).

- [ ] **Step 4: Commit**
```bash
git add lib/utils.ts package.json
git commit -m "chore: setup shadcn utils and dependencies"
```

### Task 2: Create Infinite Grid Component

**Files:**
- Create: `components/ui/infinite-grid.tsx`

- [ ] **Step 1: Write `InfiniteGrid` component**
Implement the component with brand colors and low opacity.
```tsx
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useTemplate, 
  useAnimationFrame,
  useMotionTemplate
} from "motion/react";

export const InfiniteGrid = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("absolute inset-0 overflow-hidden pointer-events-auto", className)}
    >
      {/* Static Grid Layer */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      
      {/* Mouse Reveal Layer */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-15"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-10%] top-[-10%] w-[30%] h-[30%] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute left-[-5%] bottom-[-10%] w-[25%] h-[25%] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: any, offsetY: any }) => (
  <svg className="w-full h-full">
    <defs>
      <motion.pattern
        id="grid-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        x={offsetX}
        y={offsetY}
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-brand/20" 
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
);
```

- [ ] **Step 2: Commit**
```bash
git add components/ui/infinite-grid.tsx
git commit -m "feat: add InfiniteGrid component"
```

### Task 3: Refactor Hero Section

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Integrate `InfiniteGrid` and Animations**
Update `Hero.tsx` to use the background and staggered entrance animations.
```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { InfiniteGrid } from './ui/infinite-grid';

export const Hero = () => {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      className="relative flex items-center overflow-hidden bg-white h-screen min-h-[600px] w-full" 
      id="home"
    >
      <InfiniteGrid />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] w-full h-full relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 pointer-events-none"
        >
          {/* Social Proof Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 w-fit mb-4 md:mb-8 hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt={`Client ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">Trusted by 500+ families</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="font-extrabold text-charcoal leading-[1.1] mb-0 tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            Your Dream Home <br /> Awaits
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-[18px] md:text-[22px] lg:text-[24px] text-gray-500 font-medium mt-3 md:mt-6 leading-snug"
          >
            Houston's trusted real estate partner
            <span className="block h-1 w-20 bg-brand mx-auto mt-2 rounded-full" />
          </motion.p>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-[14px] md:text-[16px] lg:text-[18px] text-gray-400 max-w-[600px] mt-5 md:mt-8 leading-relaxed font-normal"
          >
            Serving Houston, Galveston, Austin, Louisiana, Mississippi, and Florida with expert guidance, 24/7 availability, and personalized service.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto justify-center pointer-events-auto"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/properties"
                className="flex items-center justify-center gap-2 bg-charcoal-dark text-white px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-black transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <Home size={20} />
                View Listings
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/contact"
                className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-charcoal-dark border-2 border-gray-200 px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:border-brand hover:text-brand transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <Mail size={20} />
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify Build**
Run: `npm run build`
Ensure no TypeScript or linting errors.

- [ ] **Step 3: Commit**
```bash
git add components/Hero.tsx
git commit -m "feat: integrate InfiniteGrid and animations into Hero section"
```
