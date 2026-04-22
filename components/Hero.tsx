import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail } from 'lucide-react';
import { motion } from 'motion/react';

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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section 
      className="relative flex items-center overflow-hidden bg-background h-screen min-h-[600px] w-full" 
      id="home"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] w-full h-full relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10 flex flex-col items-center justify-center max-w-4xl mx-auto px-4"
        >
          {/* Social Proof Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-accent/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 w-fit mb-4 md:mb-8 hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt={`Client ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">Trusted by 500+ families</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="font-extrabold text-foreground leading-[1.1] mb-0 tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            Your Dream Home <br /> Awaits
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-[18px] md:text-[22px] lg:text-[24px] text-muted-foreground font-medium mt-3 md:mt-6 leading-snug"
          >
            Houston's trusted real estate partner
            <span className="block h-1 w-20 bg-primary mx-auto mt-2 rounded-full" />
          </motion.p>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-[14px] md:text-[16px] lg:text-[18px] text-muted-foreground/80 max-w-[600px] mt-5 md:mt-8 leading-relaxed font-normal"
          >
            Serving Houston, Galveston, Austin, Louisiana, Mississippi, and Florida with expert guidance, 24/7 availability, and personalized service.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/property-listings"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:opacity-90 transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Home size={20} />
                View Listings
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/contact-us"
                className="flex items-center justify-center gap-2 bg-background text-foreground border-2 border-border px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-accent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
