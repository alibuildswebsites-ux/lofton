
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURES } from '../data';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export const TrustSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.gsap-trust-card');

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
              start: "top 95%", // Card must be clearly in view
              end: "top 70%",
              scrub: 1,
              immediateRender: false,
              once: true,
            }
          }
        );
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const cards = gsap.utils.toArray('.gsap-trust-card');
      gsap.set(cards, { opacity: 1, rotationX: 0, y: 0, z: 0 });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[80px] lg:py-[100px] bg-background overflow-hidden" id="about">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px]">
        
        <SectionHeader 
          subtitle="Why Choose Us"
          title={<>A Real Estate Partner <br/> You Can Trust</>}
          description="We don't just facilitate transactions; we build relationships. With over 15 years of experience and a client-first approach, we're dedicated to achieving your real estate goals."
        />

         {/* Features Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="gsap-trust-card bg-accent p-8 rounded-2xl border border-border hover:shadow-lg transition-shadow duration-300" style={{ willChange: "transform, opacity" }}>
                 <div className="w-12 h-12 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center text-brand mb-6">
                    <feature.icon size={24} />
                 </div>
                 <h4 className="text-xl font-bold text-foreground mb-3">{feature.title}</h4>
                 <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
         </div>
         
         {/* CTA */}
         <div className="text-center">
             <Link 
               to="/about-us"
               className="bg-foreground text-background px-8 py-3.5 rounded-full font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 inline-block"
             >
               Meet The Team
             </Link>
         </div>

      </div>
    </section>
  );
};
