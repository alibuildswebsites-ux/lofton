
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATIONS } from '../data';
import { MapPin, ArrowRight, TrendingUp, Navigation2 } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

// Extended dummy data for better demonstration
const MOCK_LOCATIONS = [
  ...LOCATIONS,
  { id: 'l5', name: 'Sugar Land', description: 'Premium suburban living with top-tier schools and master-planned communities.', stats: { label: 'Avg Value', value: '$580k', trend: 'up' } },
  { id: 'l6', name: 'The Woodlands', description: 'Elegant forest-integrated estates and a thriving corporate hub north of Houston.', stats: { label: 'Growth', value: '+18%', trend: 'up' } },
  { id: 'l7', name: 'Pearland', description: 'Fast-growing residential center with modern amenities and diverse neighborhoods.', stats: { label: 'Avg Value', value: '$420k', trend: 'up' } },
  { id: 'l8', name: 'Austin Central', description: 'The heart of Texas tech and culture. High-demand urban properties.', stats: { label: 'Demand', value: 'High', trend: 'up' } },
];

const MapConceptCard = ({ location }: { location: any }) => (
  <div className="gsap-map-card group cursor-pointer h-full relative">
    {/* Map Node connector */}
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-brand/30" />
    
    <div className="bg-white border-2 border-gray-100 rounded-lg p-6 shadow-sm group-hover:border-brand/50 group-hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand/10 rounded-full text-brand">
          <Navigation2 size={16} className="fill-brand" />
        </div>
        <span className="text-[10px] font-mono tracking-tighter text-gray-400">COORD: 29.7604° N</span>
      </div>
      
      <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-brand transition-colors">
        {location.name}
      </h3>
      
      <p className="text-gray-500 text-xs leading-relaxed mb-6">
        {location.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{location.stats.label}: {location.stats.value}</span>
        <ArrowRight size={14} className="text-brand opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </div>
    </div>
  </div>
);

const PlaqueConceptCard = ({ location }: { location: any }) => (
  <div className="gsap-plaque-card group h-full">
    <div className="relative h-full bg-white/10 backdrop-blur-2xl border-t border-l border-white/40 rounded-sm p-8 shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5">
      {/* Metallic shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-10">
          <div className="text-white/80 font-serif italic text-lg border-b border-brand pb-1">
            {location.name}
          </div>
          <MapPin size={20} className="text-brand" />
        </div>

        <p className="text-white/70 text-sm font-light leading-loose mb-10 flex-grow">
          {location.description}
        </p>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="block text-[9px] text-brand font-black uppercase tracking-[0.3em]">Market Status</span>
            <span className="block text-2xl font-light text-white tracking-tighter uppercase">{location.stats.value}</span>
          </div>
          <div className="w-12 h-12 flex items-center justify-center border border-white/20 group-hover:border-brand transition-colors">
            <ArrowRight size={20} className="text-white group-hover:text-brand transition-all" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LocationsPreview = () => {
  useEffect(() => {
    // Animation for Map Concept (Drop-in effect)
    const mapCards = gsap.utils.toArray('.gsap-map-card');
    mapCards.forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top 70%",
            scrub: 1,
          }
        }
      );
    });

    // Animation for Plaque Concept (3D Mounting effect)
    const plaqueCards = gsap.utils.toArray('.gsap-plaque-card');
    plaqueCards.forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, rotationX: -60, z: -500, y: 150 },
        {
          opacity: 1, rotationX: 0, z: 0, y: 0,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top 75%",
            scrub: 1,
          }
        }
      );
    });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Intro Header */}
      <section className="pt-40 pb-20 bg-gray-50 border-b border-gray-100 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-charcoal mb-4 uppercase tracking-tighter">UI Design Exploration</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Demonstrating two unique conceptual directions for the Coverage section.</p>
      </section>

      {/* CONCEPT 1: THE INTERACTIVE MAP */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="mb-20">
            <div className="inline-block bg-brand/10 text-brand px-4 py-1 rounded-full text-xs font-black uppercase mb-4 tracking-widest">Option A</div>
            <h2 className="text-5xl font-black text-charcoal tracking-tighter mb-6 uppercase">CONCEPT 1: THE INTERACTIVE MAP</h2>
            <p className="text-gray-500 max-w-xl">Minimalist, architectural design that feels like coordinates on a blueprint. Uses a clean "drop-in" animation.</p>
          </div>

          <div className="relative border-t border-l border-gray-100 pt-16 pl-8">
            {/* Background Grid for Map Feel */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {MOCK_LOCATIONS.map((loc) => (
                <MapConceptCard key={loc.id} location={loc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 2: DYNAMIC GLASSMORPHISM PLAQUES */}
      <section className="py-32 bg-[#0a0a0a] overflow-hidden relative">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[150px] -mr-96 -mt-96" />
        
        <div className="max-w-[1280px] mx-auto px-5 relative z-10">
          <div className="mb-20 text-center md:text-left">
            <div className="inline-block bg-brand text-white px-4 py-1 rounded-full text-xs font-black uppercase mb-4 tracking-widest">Option B</div>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase">CONCEPT 2: GLASSMORPHISM PLAQUES</h2>
            <p className="text-gray-400 max-w-xl">Heavy glassmorphism on a dark field. High-end, luxury feel. Uses our signature 3D "Mounting" animation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" style={{ perspective: "2000px", transformStyle: "preserve-3d" }}>
            {MOCK_LOCATIONS.map((loc) => (
              <PlaqueConceptCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Spacer */}
      <section className="h-40 bg-gray-50 flex items-center justify-center italic text-gray-400 font-light">
        End of conceptual demonstration. Scroll back up to compare the architectural vs. luxury feel.
      </section>

      <Footer />
    </div>
  );
};

export default LocationsPreview;
