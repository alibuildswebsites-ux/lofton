
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';
import { MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const LocationCard = ({ location, index }: { location: any; index: number }) => {
  return (
    <div className="gsap-location-card group cursor-pointer h-full">
      <div className="relative h-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:border-brand/30 transition-all duration-500 overflow-hidden flex flex-col">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-colors duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand border border-gray-100 group-hover:scale-110 transition-transform duration-500">
              <MapPin size={28} />
            </div>
            {location.stats.trend === 'up' && (
              <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-brand-dark bg-brand/10 px-3 py-1.5 rounded-full uppercase">
                <TrendingUp size={12} /> Growing
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-extrabold text-charcoal mb-1 group-hover:text-brand transition-colors duration-300">
              {location.name}
            </h3>
            <span className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">Texas, USA</span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
            {location.description}
          </p>

          <div className="flex items-center justify-between border-t border-gray-100/50 pt-6 mt-auto">
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">
                {location.stats.label}
              </span>
              <span className="block text-xl font-bold text-charcoal">
                {location.stats.value}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-charcoal group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300">
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationsPreview = () => {
  useEffect(() => {
    const cards = gsap.utils.toArray('.gsap-location-card');
    cards.forEach((card: any) => {
      gsap.fromTo(card,
        { 
          opacity: 0, 
          rotationX: -25, 
          y: 60, 
          z: -150 
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          z: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top 80%",
            scrub: 1,
          }
        }
      );
    });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section for Context */}
      <section className="pt-40 pb-20 bg-gray-50/50 relative overflow-hidden">
        {/* Subtle Map Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="map-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="50" cy="50" r="2" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-pattern)" />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 relative z-10 text-center">
          <SectionHeader 
            subtitle="The Lofton Network"
            title={<>Our Coverage <br/> <span className="text-brand">Areas We Serve</span></>}
            description="Deep local expertise across the most vibrant markets in Texas. We understand the heartbeat of every neighborhood we represent."
          />
        </div>
      </section>

      {/* Modern Location Grid */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-50/50 to-transparent" />
        
        <div className="max-w-[1280px] mx-auto px-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
            {LOCATIONS.map((location, idx) => (
              <LocationCard key={location.id} location={location} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury CTA Section */}
      <section className="py-32 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand/5 rounded-full blur-[100px]" />
        
        <div className="max-w-[800px] mx-auto px-5 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">Looking for something specific?</h2>
          <p className="text-xl text-gray-400 mb-12 font-light">
            Our network extends beyond these primary hubs. Contact our strategy team for a personalized market analysis in any Texas region.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-brand text-white px-10 py-4 rounded-full font-bold hover:bg-brand-dark transition-all transform hover:scale-105 shadow-xl shadow-brand/20">
              Get Market Report
            </button>
            <button className="border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-charcoal transition-all">
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationsPreview;
