import React from 'react';
import { motion } from 'framer-motion';

interface SocialShareIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const SocialShareIcon: React.FC<SocialShareIconProps> = ({
  size = 'md',
  animated = true,
  className = ''
}) => {
  const dimensions = {
    sm: 24,
    md: 32,
    lg: 48
  }[size];

  const iconVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.0, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8]
    }
  };

  const Icon = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
    >
      <motion.path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={animated ? iconVariants : {}}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />
      <motion.path
        d="M9 21V12H15V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={animated ? iconVariants : {}}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        transition={animated ? { delay: 0.5 } : {}}
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        style={{ width: dimensions, height: dimensions }}
        variants={pulseVariants}
        animate="animate"
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {Icon}
      </motion.div>
    );
  }

  return (
    <div style={{ width: dimensions, height: dimensions }}>
      {Icon}
    </div>
  );
};
