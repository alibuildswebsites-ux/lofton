
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../data';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.gsap-service-card');

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
              start: "top 95%",
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
      const cards = gsap.utils.toArray('.gsap-service-card');
      gsap.set(cards, { opacity: 1, rotationX: 0, y: 0, z: 0 });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[80px] lg:py-[100px] bg-background relative overflow-hidden" id="services">
      
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] relative z-10">
        <SectionHeader 
          subtitle="Our Services"
          title={<>Real Estate Solutions <br className="hidden md:block"/> Built Around You</>}
          description="Whether you're buying your first home, selling a luxury property, or building an investment portfolio, we provide the expertise to guide you."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
          {SERVICES.map((service, idx) => {
            // Determine link based on service title for better UX
            const linkPath = service.title.includes('Buy') || service.title.includes('Home') ? '/buyers-guide' :
                           service.title.includes('Sale') || service.title.includes('Sell') ? '/sellers-guide' :
                           '/contact-us';

            return (
              <div
                key={idx}
                className="gsap-service-card group relative bg-background border border-border rounded-[24px] p-[40px] hover:border-brand/30 hover:shadow-[0_20px_40px_-15px_rgba(74,222,128,0.15)] transition-[border-color,box-shadow] duration-300 flex flex-col h-full overflow-hidden md:[&:last-child]:col-span-2 lg:[&:last-child]:col-span-1"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-[64px] h-[64px] rounded-2xl bg-muted border border-border group-hover:border-brand group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-brand-accent flex items-center justify-center mb-[32px] text-foreground group-hover:text-primary-foreground transition-[background-color,border-color,color,box-shadow,transform] duration-250 shadow-sm group-hover:shadow-lg group-hover:scale-105">
                    <service.icon size={28} strokeWidth={2} />
                  </div>

                  <h3 className="text-[24px] font-bold text-foreground mb-[16px] group-hover:text-brand-dark transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-[16px] text-muted-foreground leading-relaxed mb-[32px] flex-grow font-normal group-hover:text-muted-foreground">
                    {service.desc}
                  </p>

                  <Link 
                    to={linkPath}
                    className="flex items-center text-[15px] font-bold text-foreground group-hover:text-brand transition-colors duration-300 mt-auto cursor-pointer rounded-md w-fit py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    <span className="relative">
                      Explore Service
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 ease-out" />
                    </span>
                    <ArrowRight 
                      size={18} 
                      className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
