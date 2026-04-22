
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  label = "Lofton Realty",
  size = 'md'
}) => {
  const dimensions = {
    sm: 40,
    md: 64,
    lg: 80
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

  const containerVariants = {
    exit: { 
      opacity: 0,
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const content = (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-6" style={{ width: dimensions, height: dimensions }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <motion.path
            d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d="M9 21V12H15V21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-accent"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          />
        </svg>
        
        <motion.div 
          className="absolute inset-0 bg-brand/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="flex flex-col items-center">
        <motion.span 
          className="text-foreground font-sans font-bold tracking-[0.2em] uppercase text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {label}
        </motion.span>
        <motion.div 
          className="h-[2px] bg-brand mt-2"
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 0.7, duration: 0.5, ease: "circOut" }}
        />
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div 
        key="loader"
        variants={containerVariants}
        initial={{ opacity: 1 }}
        exit="exit"
        className="fixed inset-0 bg-background z-[99999] flex items-center justify-center overflow-hidden"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 w-full">
      {content}
    </div>
  );
};
