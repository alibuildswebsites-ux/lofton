import React, { useEffect, useRef } from 'react';
import { LOCATIONS } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from './common/SectionHeader';
import { LocationCard } from './common/LocationCard';

gsap.registerPlugin(ScrollTrigger);

export const LocationsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Animate cards on scroll
  useGSAP(() => {
    // Match media for reduced motion preference
    let mm = gsap.matchMedia();

    mm.add({
      desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      tablet: "(min-width: 640px) and (max-width: 767px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 639px) and (prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { desktop, tablet, mobile, reduce } = context.conditions as any;

      // If user prefers reduced motion, show cards instantly without animation
      if (reduce) {
        const cards = gsap.utils.toArray('.location-card') as HTMLElement[];
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        return;
      }

      // For all other cases, animate cards on scroll
      const cards = gsap.utils.toArray('.location-card') as HTMLElement[];
      
      cards.forEach((card: HTMLElement, index: number) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60, // Start 60px lower
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.12, // 0.12s stagger
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // Trigger when card is 85% in view
              end: "top 50%",
              toggleActions: "play none none none",
              once: true, // Only play animation once
              invalidateOnRefresh: true,
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          title="OUR COVERAGE"
          subtitle="Areas We Serve"
          description="Expertise across premier real estate markets"
        />

        {/* Mobile Grid (1 column) */}
        <div
          ref={gridRef}
          className="
            mt-12
            grid grid-cols-1 gap-6
            md:grid-cols-2 lg:flex lg:overflow-x-auto lg:gap-6 lg:pb-4
          "
        >
          {LOCATIONS.map((location) => (
            <div
              key={location.id}
              className="location-card"
            >
              <LocationCard location={location} />
            </div>
          ))}
        </div>

        {/* Scroll hint for desktop (optional) */}
        <div className="mt-6 hidden lg:flex justify-center">
          <p className="text-xs text-gray-500">
            Scroll to see all areas →
          </p>
        </div>
      </div>
    </section>
  );
};
