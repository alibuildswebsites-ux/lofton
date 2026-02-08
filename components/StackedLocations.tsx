
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';

gsap.registerPlugin(ScrollTrigger);

// Local asset mapping with SEO-optimized filenames
const LOCAL_IMAGES: Record<string, string> = {
  '1': '/assets/locations/houston-tx-urban-real-estate.jpg',
  '2': '/assets/locations/galveston-tx-coastal-living.jpg',
  '3': '/assets/locations/austin-tx-tech-hub-skyline.jpg',
  '4': '/assets/locations/louisiana-southern-charm-estates.jpg',
  '5': '/assets/locations/mississippi-gulf-coast-opportunities.jpg',
  '6': '/assets/locations/florida-sunshine-state-expansion.jpg',
};

// SEO-friendly Alt Tags
const SEO_ALTS: Record<string, string> = {
  '1': 'Houston Texas downtown skyline and urban luxury real estate photography.',
  '2': 'Galveston Texas coastal landscape featuring historic Gulf architecture.',
  '3': 'Austin Texas skyline view showcasing modern tech-hub urban development.',
  '4': 'Louisiana southern charm estates with historic oak trees and colonial architecture.',
  '5': 'Mississippi Gulf Coast waterfront properties and coastal investment opportunities.',
  '6': 'Florida sunshine state coastal luxury skyline and premium oceanfront realty.',
};

export const StackedLocations = () => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.stacked-card');
    const totalCards = cards.length;

    if (!triggerRef.current || totalCards === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: `+=${totalCards * 150}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    cards.forEach((card: any, i: number) => {
      const descArea = card.querySelector('.desc-area');
      const image = card.querySelector('.card-image');

      // PHASE 1: ENTRY
      tl.fromTo(card, 
        { y: '120vh', opacity: 0, scale: 0.9, rotationX: -10 },
        { y: '0%', opacity: 1, scale: 1, rotationX: 0, duration: 1.0, ease: "power2.out" }
      );

      // PHASE 2: EXPANSION & UNBLUR
      tl.to(descArea, { 
        height: 'auto', 
        opacity: 1, 
        marginTop: 32, 
        duration: 1.0, 
        ease: "power2.inOut" 
      });
      tl.to(image, {
        filter: 'blur(0px) grayscale(0%)',
        scale: 1.05,
        duration: 1.0, 
        ease: "power2.inOut"
      }, "<");

      // STAY MOMENT
      tl.to({}, { duration: 0.5 });

      // PHASE 3: COLLAPSE & RE-BLUR
      tl.to(descArea, { 
        height: 0, 
        opacity: 0, 
        marginTop: 0, 
        duration: 0.8, 
        ease: "power2.inOut" 
      });
      tl.to(image, {
        filter: 'blur(10px) grayscale(100%)',
        scale: 1,
        duration: 0.8,
        ease: "power2.inOut"
      }, "<");

      // PHASE 4: EXIT
      if (i < totalCards - 1) {
        tl.to(card, { 
          y: '-120vh', 
          opacity: 0, 
          scale: 0.9, 
          rotationX: 10, 
          duration: 1.0, 
          ease: "power2.in" 
        });
      } else {
        tl.to(card, { opacity: 0, y: -50, duration: 0.8 });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={triggerRef} className="h-screen bg-gray-50 overflow-hidden relative flex flex-col items-center justify-center font-sans px-5">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-20 w-full max-w-4xl px-5 text-center mb-8">
        <div className="inline-block bg-brand/10 border border-brand/20 text-brand px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          Our Coverage
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight mb-4">
          Areas We Serve
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base font-medium">
          Cinematic market insights across the Southern Coast's most prestigious regions.
        </p>
      </div>

      <div className="relative w-full max-w-2xl h-[650px] flex items-center justify-center">
        {LOCATIONS.map((loc, i) => (
          <div 
            key={loc.id} 
            className="stacked-card absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
            style={{ perspective: "1200px" }}
          >
            <div className="card-inner pointer-events-auto w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden shadow-brand/5">
              {/* Cinematic Thumbnail */}
              <div className="relative h-56 md:h-64 overflow-hidden bg-gray-200">
                <img 
                  src={LOCAL_IMAGES[loc.id]} 
                  alt={SEO_ALTS[loc.id]} 
                  className="card-image w-full h-full object-cover filter blur-[10px] grayscale transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              </div>

              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-3xl md:text-5xl font-bold text-charcoal tracking-tighter italic uppercase leading-none">
                      {loc.name.split(',')[0]}
                    </h3>
                    <p className="text-brand font-bold tracking-[0.4em] uppercase text-[10px]">
                      {loc.name.split(',')[1] || 'Southern Region'}
                    </p>
                  </div>
                </div>

                {/* SEO-Friendly Expansion Area */}
                <div className="desc-area h-0 opacity-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-[1px] w-6 bg-brand" />
                    <div className="text-brand font-black uppercase text-[10px] tracking-[0.3em]">
                      Market Report
                    </div>
                  </div>
                  
                  <article className="text-gray-600 text-base md:text-lg leading-relaxed font-light italic border-l-2 border-brand/20 pl-6 py-2">
                    {loc.longDescription || loc.description}
                  </article>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
