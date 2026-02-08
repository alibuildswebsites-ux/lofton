
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';
import { MapPin, TrendingUp, ArrowRight, Building } from 'lucide-react';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export const StackedLocations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.stacked-card');
    const totalCards = cards.length;

    if (!triggerRef.current || totalCards === 0) return;

    // The master timeline for the entire pinned section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: `+=${totalCards * 150}%`, // Reduced from 300% for faster scroll
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    cards.forEach((card: any, i: number) => {
      const cardInner = card.querySelector('.card-inner');
      const descArea = card.querySelector('.desc-area');
      const infoArea = card.querySelector('.info-area');

      // PHASE 1: ENTRY (From Bottom to Center)
      tl.fromTo(card, 
        { y: '120vh', opacity: 0, scale: 0.8, rotationX: -15 },
        { y: '0%', opacity: 1, scale: 1, rotationX: 0, duration: 1.0, ease: "power2.out" }
      );

      // PHASE 2: EXPANSION (Show Description)
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

      // STAY MOMENT (Pause for readability)
      tl.to({}, { duration: 0.5 });

      // PHASE 3: COLLAPSE (Hide Description)
      tl.to(descArea, { 
        height: 0, 
        opacity: 0, 
        marginTop: 0, 
        duration: 0.8, 
        ease: "power2.inOut" 
      });

      // PHASE 4: EXIT (To Top)
      if (i < totalCards - 1) {
        tl.to(card, { 
          y: '-120vh', 
          opacity: 0, 
          scale: 0.9, 
          rotationX: 15, 
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
    <section ref={triggerRef} className="h-screen bg-[#0a0a0a] overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#4ADE80 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-20 w-full max-w-4xl px-5 text-center mb-12">
        <div className="inline-block bg-brand/10 border border-brand/20 text-brand px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          Exclusive Network
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
          Areas We <span className="text-brand text-outline-white">Serve</span>
        </h2>
      </div>

      <div className="relative w-full max-w-2xl h-[500px] flex items-center justify-center">
        {LOCATIONS.map((loc, i) => (
          <div 
            key={loc.id} 
            className="stacked-card absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
            style={{ perspective: "1000px" }}
          >
            <div className="card-inner pointer-events-auto w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl ring-1 ring-white/10 overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center text-brand shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                  <MapPin size={28} />
                </div>
                {loc.stats.trend === 'up' && (
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-brand bg-brand/10 px-4 py-2 rounded-full uppercase">
                    <TrendingUp size={14} /> Growing Market
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {loc.name.split(',')[0]}
                </h3>
                <p className="text-brand font-bold tracking-[0.4em] uppercase text-[10px]">
                  {loc.name.split(',')[1] || 'Texas Region'}
                </p>
              </div>

              {/* Expandable Area */}
              <div className="desc-area h-0 opacity-0 overflow-hidden">
                <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                  "{loc.description}"
                </p>
                
                <div className="info-area opacity-0 translate-y-4 grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider mb-2">Inventory</span>
                    <span className="block text-3xl font-light text-white tracking-tighter">{loc.propertyCount}<span className="text-brand text-sm ml-1">+</span></span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider mb-2">{loc.stats.label}</span>
                    <span className="block text-3xl font-light text-white tracking-tighter">{loc.stats.value}</span>
                  </div>
                </div>

                <button className="w-full mt-10 group flex items-center justify-between bg-brand text-[#0a0a0a] px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-300">
                  Explore Market
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Tracker */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
        <span className="text-[10px] font-mono text-gray-600">01</span>
        <div className="w-40 h-[1px] bg-white/10 relative">
            {/* We could animate a progress bar here linked to scroll if needed */}
            <div className="absolute inset-0 bg-brand/50 w-1/3" />
        </div>
        <span className="text-[10px] font-mono text-gray-600">{LOCATIONS.length.toString().padStart(2, '0')}</span>
      </div>
    </section>
  );
};
