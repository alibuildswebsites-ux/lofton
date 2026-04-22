import React, { useRef } from 'react';
import { LOCATIONS } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from './common/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export const LocationsSection = () => {
  return (
    <section 
      className="py-16 bg-background" 
      id="locations"
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
