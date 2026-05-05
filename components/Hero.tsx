import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.15, delayChildren: shouldReduceMotion ? 0 : 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <section 
      className="relative flex items-center overflow-hidden bg-black h-screen min-h-[600px] w-full" 
      id="home"
      role="banner"
    >
      {/* Background Video */}
      <div 
        ref={videoRef}
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
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
            aria-label="Trusted by 500+ families"
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 w-fit mb-4 md:mb-8 hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt="Happy Lofton Realty client"
                  className="w-8 h-8 rounded-full border-2 border-white/20 object-cover"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-white">Trusted by 500+ families</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="heading-serif text-white leading-[1.1] mb-0 tracking-widest"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            Your Dream Home <br /> Awaits
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-[18px] md:text-[22px] lg:text-[24px] text-zinc-100 font-medium mt-3 md:mt-6 leading-snug"
          >
            Houston's trusted real estate partner
            <span className="block h-1 w-20 bg-primary mx-auto mt-2 rounded-full" />
          </motion.p>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-[14px] md:text-[16px] lg:text-[18px] text-zinc-200/90 max-w-[600px] mt-5 md:mt-8 leading-relaxed font-normal"
          >
            Serving Houston, Galveston, Austin, Louisiana, Mississippi, and Florida with expert guidance, 24/7 availability, and personalized service.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link 
                to="/property-listings"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:opacity-90 transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Home size={20} />
                View Listings
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link 
                to="/contact-us"
                className="flex items-center justify-center gap-2 bg-white/10 text-white backdrop-blur-sm border-2 border-white/20 px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
