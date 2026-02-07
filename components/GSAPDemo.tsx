
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

gsap.registerPlugin(ScrollTrigger);

const GSAPDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.gsap-card');
    
    cards.forEach((card: any) => {
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          rotationX: -45, 
          z: -500,
          y: 100 
        },
        {
          opacity: 1,
          rotationX: 0,
          z: 0,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            scrub: 1, // Smoothly links animation to scroll
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const demoCards = [
    { id: 1, title: "Modern Villa", price: "$1,200,000", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Luxury Penthouse", price: "$3,500,000", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Beachfront Estate", price: "$5,800,000", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Urban Loft", price: "$850,000", image: "https://images.unsplash.com/photo-1536376074432-bc42fa95b7c6?auto=format&fit=crop&w=800&q=80" },
    { id: 5, title: "Country Mansion", price: "$2,100,000", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" },
    { id: 6, title: "Suburban Family Home", price: "$450,000", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="bg-charcoal min-h-screen text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-5">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter">
          GSAP <span className="text-brand">3D Scroll</span> Demo
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Scroll down to see the 3D perspective transition. We can apply this logic to your actual property cards and sections.
        </p>
        <div className="mt-10 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 3D Grid Section */}
      <section className="max-w-7xl mx-auto px-5 py-32" style={{ perspective: "1200px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {demoCards.map(card => (
            <div 
              key={card.id} 
              className="gsap-card bg-white rounded-3xl overflow-hidden shadow-2xl transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="h-64 overflow-hidden">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-charcoal mb-2">{card.title}</h3>
                <p className="text-brand text-xl font-extrabold">{card.price}</p>
                <div className="mt-6 h-1 w-12 bg-brand rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="h-screen flex items-center justify-center bg-brand text-charcoal">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Pretty Smooth, Right?</h2>
          <p className="text-xl opacity-80">We can use this to make your website stand out from competitors.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GSAPDemo;
