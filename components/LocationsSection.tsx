
import React, { useState, useEffect, useRef } from 'react';
import { LOCATIONS } from '../data';
import { LocationArea } from '../types';
import { MapPin, TrendingUp, ArrowRight, X, Building, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils';
import { SectionHeader } from './common/SectionHeader';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animation timing constant
const SCROLL_PIN_START = "top 15%";

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
        // Pause Lenis when modal is open
        if ((window as any).lenis) (window as any).lenis.stop();
    } else {
        // Resume Lenis when modal is closed
        if ((window as any).lenis) (window as any).lenis.start();
    }
  }, [selectedLocation]);

  useGSAP(() => {
    const track = document.querySelector('.gsap-track') as HTMLElement;
    const pinWrapper = document.querySelector('.gsap-pin-wrapper') as HTMLElement;
    if (!track || !pinWrapper) return;

    let mm = gsap.matchMedia();

    mm.add({
      desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      reduce: "(max-width: 767px), (prefers-reduced-motion: reduce)"
    }, (context) => {
      let { desktop } = context.conditions as any;

      if (desktop) {
        // Calculate the exact distance to translate the track
        const getScrollAmount = () => -(track.scrollWidth - pinWrapper.offsetWidth);

        // 1. Horizontal Scroll Tween
        const tween = gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
        });

        // 2. ScrollTrigger for the Pin
        ScrollTrigger.create({
          trigger: pinWrapper,
          start: SCROLL_PIN_START, 
          end: () => `+=${track.scrollWidth}`, 
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true,
        });

        // 3. Inner Parallax for Images
        const images = gsap.utils.toArray('.gsap-card-img');
        images.forEach((img: any) => {
          gsap.to(img, {
            xPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: pinWrapper,
              start: SCROLL_PIN_START,
              end: () => `+=${track.scrollWidth}`,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });
        });
      }
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [] });


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
        
        {/* Outer Pin Wrapper */}
        <div className="gsap-pin-wrapper relative w-full h-[600px] md:h-[700px] mt-12 overflow-hidden">
          {/* Horizontal Track */}
          <div className="gsap-track flex flex-nowrap h-full w-full md:w-max gap-[30px] md:gap-[40px] px-5 md:px-10 overflow-x-auto snap-x snap-mandatory md:overflow-visible md:snap-none pb-8 md:pb-0">
            {LOCATIONS.map((location) => (
              <div key={location.id} className="gsap-location-card relative flex-shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] h-full snap-center rounded-2xl overflow-hidden group cursor-pointer border border-gray-200/20 shadow-xl" style={{ willChange: "transform" }}>
                <button 
                  onClick={() => setSelectedLocation(location)}
                  className="w-full h-full text-left relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  aria-label={`View details for ${location.name}`}
                >
                  {/* Background Image Wrapper for Parallax */}
                  <div className="absolute inset-0 overflow-hidden bg-gray-900">
                    <img 
                      src={getOptimizedImageUrl(location.image, 800)} 
                      alt={location.name}
                      className="gsap-card-img absolute inset-0 w-[120%] h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 left-0"
                      style={{ willChange: "transform" }}
                      loading="lazy"
                      onError={() => console.warn(`Failed to load image for ${location.name}`)}
                    />
                  </div>
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/95 via-charcoal-dark/40 to-transparent pointer-events-none" />

                  {/* Content (Pinned to bottom) */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight group-hover:text-brand transition-colors">{location.name}</h3>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2">{location.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/20 pt-5 mt-2">
                      <div>
                        <span className="block text-xs text-brand font-bold uppercase tracking-wider mb-1">{location.stats.label}</span>
                        <span className="block text-xl font-bold text-white">{location.stats.value}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all duration-300">
                         <ArrowRight size={24} />
                      </div>
                    </div>

                    {location.stats.trend === 'up' && (
                      <div className="absolute top-8 left-8 flex items-center gap-1.5 text-xs font-bold text-charcoal bg-brand px-3 py-1.5 rounded-full shadow-lg">
                        <TrendingUp size={14} /> Growing Market
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
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
                  onError={() => {
                    setImageLoaded(true);
                    console.warn(`Failed to load modal image for ${selectedLocation.name}`);
                  }}
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
