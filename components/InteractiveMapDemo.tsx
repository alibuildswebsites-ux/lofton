
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';
import { MapPin, TrendingUp, ArrowRight, Building } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

gsap.registerPlugin(ScrollTrigger);

const InteractiveMapDemo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const map = mapRef.current;
    const cards = gsap.utils.toArray('.location-panel');

    if (!section || !map || cards.length === 0) return;

    // SCROLLYTELLING MASTER TIMELINE
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${cards.length * 100}%`, // Scroll length based on number of locations
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    // Animate map panning and card visibility
    cards.forEach((card: any, i: number) => {
      // Move map to specific coordinates (simplified as percentages for this demo)
      // Houston (Center-ish), Galveston (South of Houston), Austin (West), Louisiana (East), etc.
      const positions = [
        { x: 0, y: 0, scale: 1 },      // Houston
        { x: -5, y: -20, scale: 1.5 }, // Galveston (zoom in)
        { x: 30, y: 0, scale: 1.2 },   // Austin
        { x: -50, y: 10, scale: 1 },   // Louisiana
        { x: -80, y: 20, scale: 1 },   // Mississippi
        { x: -150, y: 60, scale: 1.3 } // Florida
      ];

      const pos = positions[i] || { x: 0, y: 0, scale: 1 };

      // Fade in current panel
      tl.to(card, { opacity: 1, y: 0, duration: 0.5 }, i === 0 ? 0 : ">-0.2");
      
      // Pan map
      tl.to(map, {
        xPercent: pos.x,
        yPercent: pos.y,
        scale: pos.scale,
        duration: 1,
        ease: "power2.inOut"
      }, "<");

      // Stay on panel for a bit
      tl.to({}, { duration: 0.5 }); 

      // Fade out current panel (unless it's the last one)
      if (i < cards.length - 1) {
        tl.to(card, { opacity: 0, y: -20, duration: 0.3 });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-charcoal min-h-screen text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Intro */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-5 bg-charcoal relative z-20">
        <div className="inline-block bg-brand/20 text-brand px-4 py-1 rounded-full text-xs font-black uppercase mb-6 tracking-widest animate-pulse">
          New Feature Preview
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic">
          THE <span className="text-brand">LOFTON</span><br/>JOURNEY
        </h1>
        <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
          Scroll down to experience our multi-state coverage through a high-performance scrollytelling map.
        </p>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-[10px] uppercase font-bold tracking-widest">Start Journey</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand to-transparent" />
        </div>
      </section>

      {/* SCROLLYTELLING SECTION */}
      <section ref={sectionRef} className="h-screen relative flex items-center overflow-hidden bg-[#050505]">
        
        {/* THE MAP BACKGROUND (SVG) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg 
            ref={mapRef}
            viewBox="0 0 1000 600" 
            className="w-[150%] md:w-[120%] h-auto opacity-40 transition-opacity duration-1000"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Lines for Blueprint feel */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74, 222, 128, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simplified Gulf Coast Path */}
            <path 
              d="M100,200 C150,180 200,220 250,200 S350,150 400,180 S500,250 600,220 S750,350 850,400 L900,550 L100,550 Z" 
              stroke="#4ADE80" 
              strokeWidth="2" 
              strokeDasharray="5 5"
              className="opacity-50"
            />

            {/* State Outlines & Pins */}
            {LOCATIONS.map((loc, i) => {
              // Approximate coordinates for the journey
              const coords = [
                { x: 300, y: 250 }, // Houston
                { x: 320, y: 300 }, // Galveston
                { x: 220, y: 230 }, // Austin
                { x: 500, y: 280 }, // Louisiana
                { x: 620, y: 300 }, // Mississippi
                { x: 800, y: 450 }  // Florida
              ];
              const p = coords[i];
              return (
                <g key={loc.id}>
                  <circle cx={p.x} cy={p.y} r="8" fill="#4ADE80" className="animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
                  <circle cx={p.x} cy={p.y} r="20" stroke="#4ADE80" strokeWidth="1" opacity="0.3" />
                  <text x={p.x + 15} y={p.y + 5} fill="white" className="text-[14px] font-bold uppercase tracking-tighter opacity-80">{loc.name.split(',')[0]}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* FLOATING PANELS */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-10 h-full flex items-center pointer-events-none">
          <div className="w-full md:w-1/3 pointer-events-auto">
            {LOCATIONS.map((loc, i) => (
              <div 
                key={loc.id}
                className="location-panel absolute top-1/2 -translate-y-1/2 opacity-0 transform translate-y-10 transition-all duration-300"
              >
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl ring-1 ring-white/10 max-w-sm">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand/20 flex items-center justify-center text-brand">
                      <MapPin size={24} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-brand bg-brand/10 px-3 py-1.5 rounded-full uppercase">
                      <TrendingUp size={12} /> {loc.stats.trend === 'up' ? 'Hot Market' : 'Stable'}
                    </div>
                  </div>

                  <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">
                    {loc.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    {loc.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div>
                      <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Properties</span>
                      <span className="block text-2xl font-light text-white tracking-tighter">{loc.propertyCount}+</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">{loc.stats.label}</span>
                      <span className="block text-2xl font-light text-brand tracking-tighter">{loc.stats.value}</span>
                    </div>
                  </div>

                  <button className="mt-10 w-full group flex items-center justify-between bg-white text-charcoal p-5 rounded-2xl font-bold hover:bg-brand hover:text-white transition-all duration-500">
                    Explore Listings
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Journey Progress (Right Side) */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 z-30">
          {LOCATIONS.map((_, i) => (
            <div key={i} className="flex items-center justify-end gap-4 group">
              <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-brand transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Outro Section */}
      <section className="py-40 bg-charcoal flex items-center justify-center text-center">
        <div className="max-w-2xl px-5">
           <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight uppercase">Ready to start your journey?</h2>
           <p className="text-xl text-gray-400 mb-12">From the Gulf Coast to the Hill Country, we have the network to find your perfect place.</p>
           <button className="bg-brand text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-brand/20 uppercase tracking-widest">
             Contact Lofton Realty
           </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InteractiveMapDemo;
