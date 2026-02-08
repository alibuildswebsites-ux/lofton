
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { LOCATIONS } from '../data';
import { LocationArea } from '../types';
import { MapPin, TrendingUp, ArrowRight, X, Building, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils';
import { SectionHeader } from './common/SectionHeader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const LocationsSection = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationArea | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLocation(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Reset image loaded state when location changes
  useEffect(() => {
    if (selectedLocation) {
        setImageLoaded(false);
    }
  }, [selectedLocation]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.gsap-stacked-card');
      if (cards.length === 0) return;

      const totalCards = cards.length;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${totalCards * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      cards.forEach((card: any, i: number) => {
        if (i === 0) {
          // First card starts in position or slides in early
          gsap.set(card, { zIndex: i });
        } else {
          // Subsequent cards slide from bottom
          tl.fromTo(card, 
            { y: '100vh', opacity: 0 },
            { 
              y: '0%', 
              opacity: 1, 
              duration: 1, 
              ease: "none"
            }
          );
          
          // Optionally dim the card below
          tl.to(cards[i-1] as any, {
            scale: 0.95,
            opacity: 0.5,
            duration: 0.5,
            ease: "none"
          }, "<");
        }
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  const handleNavigateToProperties = (locationName: string) => {
    navigate(`/property-listings?location=${encodeURIComponent(locationName)}`);
    setSelectedLocation(null);
  };

  return (
    <section ref={triggerRef} className="bg-gray-50 relative overflow-hidden" id="areas">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] relative z-10 min-h-screen flex flex-col pt-20">
        <SectionHeader 
          subtitle="Our Coverage"
          title="Areas We Serve"
          description="Local expertise with a broad reach. Click a location below to explore market insights and available homes."
        />
        
        {/* Stack Container */}
        <div className="flex-grow relative mt-8 md:mt-12 mb-12 md:mb-20 flex items-center justify-center">
          <div className="relative w-full max-w-2xl h-[400px] sm:h-[450px] md:h-[500px]">
            {LOCATIONS.map((location, index) => (
              <div 
                key={location.id} 
                className="gsap-stacked-card absolute inset-0 w-full h-full flex items-center justify-center"
              >
                <button 
                  onClick={() => setSelectedLocation(location)}
                  className="bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-2xl transition-all duration-300 group cursor-pointer text-left w-full h-full flex flex-col"
                  aria-label={`View details for ${location.name}`}
                >
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-charcoal group-hover:bg-brand group-hover:text-white transition-colors">
                      <MapPin size={24} className="md:hidden" />
                      <MapPin size={28} className="hidden md:block" />
                    </div>
                    {location.stats.trend === 'up' && (
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-green-100 whitespace-nowrap">
                        <TrendingUp size={12} className="md:hidden" />
                        <TrendingUp size={14} className="hidden md:block" /> 
                        <span className="hidden xs:inline">Growing Market</span>
                        <span className="xs:hidden">Growing</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4 md:mb-6 overflow-hidden">
                    <h3 className="text-2xl md:text-4xl font-bold text-charcoal mb-1 md:mb-2 group-hover:text-brand transition-colors tracking-tight truncate">{location.name}</h3>
                    <p className="text-gray-500 text-sm md:text-lg leading-relaxed line-clamp-4 md:line-clamp-none">{location.description}</p>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 md:pt-6">
                    <div>
                      <span className="block text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5 md:mb-1">{location.stats.label}</span>
                      <span className="block text-xl md:text-2xl font-bold text-charcoal">{location.stats.value}</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-charcoal text-white flex items-center justify-center group-hover:bg-brand transition-all duration-300">
                       <ArrowRight size={20} className="md:hidden" />
                       <ArrowRight size={24} className="hidden md:block" />
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-12 text-center">
          <Link to="/contact-us" className="text-charcoal font-bold border-b-2 border-brand/20 hover:border-brand pb-0.5 transition-colors">
            Contact us for market specifics
          </Link>
        </div>
      </div>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLocation(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-64 flex-shrink-0 bg-gray-100">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                        <Loader2 className="animate-spin text-gray-400" />
                    </div>
                )}
                <img 
                  src={getOptimizedImageUrl(selectedLocation.image, 800)} 
                  alt={selectedLocation.name} 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button onClick={() => setSelectedLocation(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md z-20"><X size={20} /></button>
                <div className="absolute bottom-6 left-6 md:left-8 text-white z-10">
                  <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">{selectedLocation.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 font-medium text-sm"><Building size={16} /><span>{selectedLocation.propertyCount} properties</span></div>
                </div>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{selectedLocation.longDescription}</p>
                <button onClick={() => handleNavigateToProperties(selectedLocation.name)} className="w-full bg-brand text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2">
                  View Properties in {selectedLocation.name} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
