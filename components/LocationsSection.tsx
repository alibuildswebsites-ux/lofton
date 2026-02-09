
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
  const sectionRef = useRef<HTMLDivElement>(null);

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
    const initGSAP = () => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray('.gsap-location-card');
        
        // Force initial state immediately
        gsap.set(cards, { 
          opacity: 0, 
          rotationX: -25, 
          y: 60, 
          z: -150 
        });

        cards.forEach((card: any) => {
          gsap.to(card, {
            opacity: 1,
            rotationX: 0,
            y: 0,
            z: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%", // More deliberate entry
              end: "top 70%",
              scrub: 1,
              immediateRender: false,
            }
          });
        });
      }, sectionRef);
      return ctx;
    };

    let ctx: gsap.Context;

    const handleReady = () => {
      ctx = initGSAP();
    };

    // If app is already ready (e.g. on navigation), init immediately
    // Otherwise wait for the event
    if ((window as any).appReady || !document.querySelector('.global-loader')) {
      ctx = initGSAP();
    } else {
      window.addEventListener('appReady', handleReady);
    }

    return () => {
      if (ctx) ctx.revert();
      window.removeEventListener('appReady', handleReady);
    };
  }, []);

  const handleNavigateToProperties = (locationName: string) => {
    navigate(`/property-listings?location=${encodeURIComponent(locationName)}`);
    setSelectedLocation(null);
  };

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[80px] lg:py-[100px] bg-gray-50 relative overflow-hidden" id="areas">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] relative z-10">
        <SectionHeader 
          subtitle="Our Coverage"
          title="Areas We Serve"
          description="Local expertise with a broad reach. Click a location below to explore market insights and available homes."
        />
        
        {/* Locations Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-12" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
           {LOCATIONS.map((location) => (
             <div key={location.id} className="gsap-location-card h-full opacity-0">
               <button 
                 onClick={() => setSelectedLocation(location)}

                 className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer text-left w-full h-full flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                 aria-label={`View details for ${location.name}`}
               >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-charcoal group-hover:bg-brand group-hover:text-white transition-colors">
                       <MapPin size={24} />
                    </div>
                    {location.stats.trend === 'up' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                        <TrendingUp size={14} /> Growing Market
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-2 group-hover:text-brand transition-colors tracking-tight">{location.name}</h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3">{location.description}</p>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{location.stats.label}</span>
                      <span className="block text-xl font-bold text-charcoal">{location.stats.value}</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-charcoal text-white flex items-center justify-center group-hover:bg-brand transition-all duration-300">
                       <ArrowRight size={24} />
                    </div>
                  </div>
               </button>
             </div>
           ))}
        </div>

        <div className="mt-16 text-center">
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLocation(null)} aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col pointer-events-auto"
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
                  <div className="flex items-center gap-2 text-white/90 font-medium text-sm md:text-base"><Building size={16} /><span>{selectedLocation.propertyCount} properties available</span></div>
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
