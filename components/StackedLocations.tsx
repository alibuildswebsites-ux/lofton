
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
      const infoArea = card.querySelector('.info-area');

      // PHASE 1: ENTRY
      tl.fromTo(card, 
        { y: '120vh', opacity: 0, scale: 0.9, rotationX: -10 },
        { y: '0%', opacity: 1, scale: 1, rotationX: 0, duration: 1.0, ease: "power2.out" }
      );

      // PHASE 2: EXPANSION
      tl.to(descArea, { 
        height: 'auto', 
        opacity: 1, 
        marginTop: 24, 
        duration: 1.0, 
        ease: "power2.inOut" 
      });
      tl.to(infoArea, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6 
      }, "<0.5");

      // STAY MOMENT
      tl.to({}, { duration: 0.5 });

      // PHASE 3: COLLAPSE
      tl.to(descArea, { 
        height: 0, 
        opacity: 0, 
        marginTop: 0, 
        duration: 0.8, 
        ease: "power2.inOut" 
      });

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
    <section ref={triggerRef} className="h-screen bg-gray-50 overflow-hidden relative flex flex-col items-center justify-center font-sans">
      {/* Background Atmosphere - Subtly matching home page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-20 w-full max-w-4xl px-5 text-center mb-12">
        <div className="inline-block bg-brand/10 border border-brand/20 text-brand px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          Our Coverage
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight mb-4">
          Areas We Serve
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Local expertise with a broad reach. Explore our primary service markets across the region.
        </p>
      </div>

      <div className="relative w-full max-w-2xl h-[600px] flex items-center justify-center">
        {LOCATIONS.map((loc, i) => (
          <div 
            key={loc.id} 
            className="stacked-card absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none px-5"
            style={{ perspective: "1200px" }}
          >
            <div className="card-inner pointer-events-auto w-full bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden shadow-brand/5">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-charcoal group-hover:bg-brand group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                {loc.stats.trend === 'up' && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase">
                    <TrendingUp size={12} /> Growing Market
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
                  {loc.name.split(',')[0]}
                </h3>
                <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">
                  {loc.name.split(',')[1] || 'Texas Region'}
                </p>
              </div>

              {/* Expandable Area */}
              <div className="desc-area h-0 opacity-0 overflow-hidden">
                <div className="text-brand font-black uppercase text-[10px] tracking-[0.2em] mb-3">
                  Market Insights
                </div>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  {loc.longDescription || loc.description}
                </p>
                
                <div className="info-area opacity-0 translate-y-4 grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-50">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Listings</span>
                    <span className="block text-2xl font-bold text-charcoal tracking-tight">{loc.propertyCount}<span className="text-brand text-sm ml-1">+</span></span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{loc.stats.label}</span>
                    <span className="block text-2xl font-bold text-charcoal tracking-tight">{loc.stats.value}</span>
                  </div>
                </div>

                <button className="w-full mt-10 group flex items-center justify-between bg-charcoal text-white px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-charcoal/20">
                  View Market Details
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Tracker */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
        <span className="text-[10px] font-bold text-gray-300">01</span>
        <div className="w-32 h-[2px] bg-gray-200 relative overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-brand w-1/3 rounded-full" />
        </div>
        <span className="text-[10px] font-bold text-gray-300">{LOCATIONS.length.toString().padStart(2, '0')}</span>
      </div>
    </section>
  );
};
