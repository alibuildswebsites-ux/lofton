import React, { useRef } from 'react';
import { LOCATIONS } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export const LocationsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);

  const trustProofByLocation: Record<string, string> = {
    '1': 'Established guidance for urban and suburban buyers',
    '2': 'Coastal market insight with investor-focused support',
    '3': 'Reliable advice for fast-moving tech corridor homes',
    '4': 'Hands-on support for distinctive Southern properties',
    '5': 'Practical strategies for value-driven Gulf Coast moves',
    '6': 'Confident execution across high-demand Sunshine markets'
  };

  // Animate cards on scroll
  useGSAP(() => {
    // Match media for reduced motion preference
    let mm = gsap.matchMedia();

    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { reduce } = context.conditions as any;

      // If user prefers reduced motion, show cards instantly without animation
      if (reduce) {
        const badges = gsap.utils.toArray('.coverage-badge') as HTMLElement[];
        badges.forEach((badge) => {
          badge.style.opacity = '1';
          badge.style.transform = 'translateY(0)';
        });
        return;
      }

      const badges = gsap.utils.toArray('.coverage-badge') as HTMLElement[];
      
      badges.forEach((badge: HTMLElement, index: number) => {
        gsap.fromTo(
          badge,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: badge,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
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
      className="py-16 bg-accent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="OUR COVERAGE"
          subtitle="Areas We Serve"
          description="Trusted local guidance across key markets we serve"
        />

        <ul ref={rowRef} className="mt-10 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {LOCATIONS.map((location) => (
            <li
              key={location.id}
              className="
                coverage-badge min-w-[260px] sm:min-w-[300px] lg:min-w-[340px]
                rounded-xl border border-border bg-background px-5 py-5
                shadow-sm transition-[box-shadow,border-color] duration-300 ease-out
                hover:shadow-md
                will-change-transform
              "
              style={{ willChange: 'transform, opacity' }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark">Local Coverage</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{location.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{trustProofByLocation[location.id] || location.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
