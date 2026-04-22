import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
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
      className={cn("absolute inset-0 overflow-hidden pointer-events-auto bg-background", className)}
    >
      {/* Static Grid Layer */}
      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.1]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      
      {/* Mouse Reveal Layer */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.3]"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-10%] top-[-10%] w-[45%] h-[45%] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute left-[-5%] bottom-[-10%] w-[35%] h-[35%] rounded-full bg-chart-2/15 dark:bg-chart-2/5 blur-[100px]" />
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
          className="text-foreground/30 dark:text-foreground/20" 
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
);

