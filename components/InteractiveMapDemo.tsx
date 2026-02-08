
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';
import { MapPin, TrendingUp, ArrowRight, Building, Compass, Activity, Users, Home as HomeIcon } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

gsap.registerPlugin(ScrollTrigger);

// REALISTIC SVG STATE PATHS (Approximated for performance and visual clarity)
const STATE_PATHS = {
  Texas: "M200,100 L280,100 L280,180 L350,180 L380,250 L340,400 L300,450 L180,380 L120,380 L100,280 L150,220 L150,150 Z",
  Louisiana: "M380,250 L450,250 L450,320 L480,320 L480,380 L420,380 L380,350 Z",
  Mississippi: "M480,220 L550,220 L550,380 L500,380 L480,320 Z",
  Florida: "M600,250 L850,250 L880,300 L850,450 L800,550 L750,450 L780,320 L600,320 Z"
};

const InteractiveMapDemo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const [activeState, setActiveState] = useState<string>('Texas');

  useEffect(() => {
    const section = sectionRef.current;
    const map = mapRef.current;
    const panels = gsap.utils.toArray('.location-panel');

    if (!section || !map || panels.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${panels.length * 120}%`,
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          // Logic to update active state based on progress
          const progress = self.progress;
          if (progress < 0.45) setActiveState('Texas');
          else if (progress < 0.6) setActiveState('Louisiana');
          else if (progress < 0.75) setActiveState('Mississippi');
          else setActiveState('Florida');
        }
      }
    });

    panels.forEach((panel: any, i: number) => {
      // Map focus coordinates
      const viewConfigs = [
        { x: 150, y: 100, scale: 1.8 }, // Houston (TX)
        { x: 120, y: -50, scale: 2.2 }, // Galveston (TX)
        { x: 280, y: 150, scale: 2.0 }, // Austin (TX)
        { x: -100, y: 100, scale: 1.5 }, // Louisiana
        { x: -250, y: 80, scale: 1.5 }, // Mississippi
        { x: -650, y: -100, scale: 1.2 } // Florida
      ];

      const cfg = viewConfigs[i] || { x: 0, y: 0, scale: 1 };

      // Fade in/out panel content
      tl.fromTo(panel.querySelectorAll('.stagger-item'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }, 
        i === 0 ? 0 : ">-0.4"
      );

      // Pan & Zoom Map
      tl.to(map, {
        xPercent: cfg.x,
        yPercent: cfg.y,
        scale: cfg.scale,
        duration: 1.2,
        ease: "power3.inOut"
      }, "<");

      tl.to({}, { duration: 0.8 }); // Wait time

      if (i < panels.length - 1) {
        tl.to(panel.querySelectorAll('.stagger-item'), { opacity: 0, y: -30, stagger: 0.05, duration: 0.4 });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden font-sans">
      <Navbar />

      {/* FIXED HUD ELEMENTS */}
      <div className="fixed top-32 right-10 z-50 hidden lg:flex flex-col items-end gap-6 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-4">
          <Compass className="text-brand animate-spin-slow" size={32} />
          <div className="h-20 w-[1px] bg-gradient-to-b from-brand to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] vertical-text transform rotate-180">Navigation Active</span>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
          <div className="text-[10px] font-mono text-brand mb-1">CURRENT_REGION</div>
          <div className="text-xl font-black uppercase italic tracking-tighter">{activeState}</div>
        </div>
      </div>

      {/* INTRO HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-5 relative z-20 overflow-hidden">
        {/* Topo lines background for hero */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><defs><pattern id="hero-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#hero-grid)" /></svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="inline-block bg-brand text-[#050505] px-6 py-2 rounded-full text-[10px] font-black uppercase mb-8 tracking-[0.4em] shadow-[0_0_30px_rgba(74,222,128,0.3)]">
            Lofton Global Network
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none mb-10 uppercase italic">
            REAL ESTATE<br/><span className="text-brand">ATLAS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-light leading-relaxed px-5">
            A cinematic journey through the most prestigious markets along the Southern Coast. Excellence across boundaries.
          </p>
        </motion.div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-brand rounded-full" 
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Scroll to Explore</span>
        </div>
      </section>

      {/* SCROLLYTELLING SECTION */}
      <section ref={sectionRef} className="h-screen relative flex items-center overflow-hidden bg-[#080808]">
        
        {/* BACKGROUND TOPOGRAPHY */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '60px 60px' }} />
        </div>

        {/* THE INTERACTIVE MAP */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg 
            ref={mapRef}
            viewBox="0 0 1000 600" 
            className="w-[180%] md:w-[140%] h-auto transition-opacity duration-1000"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Water / Gulf Area */}
            <path d="M0,400 Q500,600 1000,400 L1000,600 L0,600 Z" fill="url(#gulf-gradient)" opacity="0.1" />
            <defs>
              <linearGradient id="gulf-gradient" x1="500" y1="400" x2="500" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ADE80" stopOpacity="0.5"/>
                <stop offset="1" stopColor="#050505" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Realistic State Outlines */}
            {Object.entries(STATE_PATHS).map(([name, path]) => (
              <g key={name}>
                <path 
                  d={path} 
                  stroke={activeState === name ? "#4ADE80" : "rgba(255,255,255,0.1)"} 
                  strokeWidth={activeState === name ? "2" : "1"}
                  fill={activeState === name ? "rgba(74, 222, 128, 0.05)" : "none"}
                  className="transition-all duration-700 ease-out"
                />
                {activeState === name && (
                   <path d={path} stroke="#4ADE80" strokeWidth="8" opacity="0.1" className="blur-md" />
                )}
              </g>
            ))}

            {/* City Nodes */}
            {LOCATIONS.map((loc, i) => {
              const coords = [
                { x: 260, y: 280 }, // Houston
                { x: 270, y: 330 }, // Galveston
                { x: 200, y: 250 }, // Austin
                { x: 420, y: 320 }, // Louisiana
                { x: 520, y: 300 }, // Mississippi
                { x: 780, y: 350 }  // Florida
              ];
              const p = coords[i];
              return (
                <g key={loc.id}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#4ADE80" />
                  <circle cx={p.x} cy={p.y} r="12" stroke="#4ADE80" strokeWidth="1" opacity="0.2">
                    <animate attributeName="r" from="4" to="20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* REDESIGNED DASHBOARD CARDS */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 md:px-10 h-full flex items-center pointer-events-none">
          <div className="w-full md:w-[600px] pointer-events-auto relative h-[500px]">
            {LOCATIONS.map((loc, i) => (
              <div 
                key={loc.id}
                className="location-panel absolute inset-0 opacity-0 pointer-events-none"
              >
                <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/5 h-full">
                  
                  {/* Left: Visual Column */}
                  <div className="w-full md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                    <img 
                      src={loc.image} 
                      alt={loc.name} 
                      className="stagger-item absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                    <div className="absolute bottom-6 left-6 stagger-item">
                        <div className="bg-brand text-[#050505] px-3 py-1 rounded text-[9px] font-black uppercase">Established Market</div>
                    </div>
                  </div>

                  {/* Right: Data Column */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <div className="stagger-item flex items-center gap-2 text-brand mb-4">
                        <Activity size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Real-Time Market Insight</span>
                    </div>

                    <h3 className="stagger-item text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">
                      {loc.name.split(',')[0]}<br/>
                      <span className="text-gray-600">{loc.name.split(',')[1] || 'Region'}</span>
                    </h3>
                    
                    <p className="stagger-item text-gray-400 text-xs leading-relaxed mb-8 max-w-sm">
                      {loc.description}. Local expertise driving exceptional results in {loc.name.split(',')[0]}.
                    </p>

                    <div className="stagger-item grid grid-cols-2 gap-8 mb-10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <HomeIcon size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Properties</span>
                        </div>
                        <div className="text-2xl font-light text-white tracking-tighter">{loc.propertyCount}<span className="text-brand text-sm ml-1">+</span></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <TrendingUp size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">{loc.stats.label}</span>
                        </div>
                        <div className="text-2xl font-light text-white tracking-tighter">{loc.stats.value}</div>
                      </div>
                    </div>

                    <button className="stagger-item w-full group flex items-center justify-between bg-white text-charcoal px-8 py-5 rounded-2xl font-bold hover:bg-brand hover:text-white transition-all duration-500 overflow-hidden relative">
                      <span className="relative z-10 uppercase tracking-widest text-xs">Explore Local Listings</span>
                      <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                      <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Progress Indicators (Bottom) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {LOCATIONS.map((_, i) => (
             <div key={i} className={`h-1 rounded-full transition-all duration-500 ${activeState === (i < 3 ? 'Texas' : i === 3 ? 'Louisiana' : i === 4 ? 'Mississippi' : 'Florida') ? 'w-12 bg-brand' : 'w-4 bg-white/20'}`} />
          ))}
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-40 bg-[#050505] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl px-5 relative z-10">
           <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic">Ready to find<br/>your <span className="text-brand">Place?</span></h2>
           <p className="text-xl text-gray-500 mb-12 font-light max-w-xl mx-auto">Our specialized team is ready to provide custom market analysis for any region in the Southern Network.</p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <button className="w-full sm:w-auto bg-brand text-[#050505] px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(74,222,128,0.2)]">
               Contact Strategy Team
             </button>
             <button className="w-full sm:w-auto border border-white/20 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-charcoal transition-all">
               View All Markets
             </button>
           </div>
        </div>
      </section>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};

export default InteractiveMapDemo;
