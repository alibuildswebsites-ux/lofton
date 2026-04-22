
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Agent } from '../../types';
import { getAgents } from '../../lib/firebase/firestore';
import { AgentCard } from './AgentCard';
import { Search } from 'lucide-react';
import { updateSEO } from '../../utils';
import { AgentSkeleton } from '../common/Skeleton';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AgentList = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateSEO({
      title: "Meet Our Real Estate Agents | Lofton Realty Team",
      description: "Get to know the experienced real estate professionals at Lofton Realty. Our team is dedicated to helping you buy or sell your home in Houston.",
      url: "https://lofton-psi.vercel.app/agents"
    });

    const fetchAgents = async () => {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
      setLoading(false);
      // Refresh ScrollTrigger after data loads
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    fetchAgents();
  }, []);

  useGSAP(() => {
    if (loading || agents.length === 0) return;

    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.gsap-agent-card');
      
      gsap.fromTo(cards, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.2
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const cards = gsap.utils.toArray('.gsap-agent-card');
      gsap.set(cards, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [loading, agents] });

  return (
    <div className="font-sans bg-accent min-h-screen">
      <Navbar />

      <div className="bg-background border-b border-border pt-32 pb-12">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 text-center">
          <span className="text-brand font-bold tracking-widest uppercase text-sm mb-3 block">Our Experts</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Meet The Team
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dedicated professionals committed to your real estate success.
          </p>
        </div>
      </div>

      <main ref={sectionRef} className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <AgentSkeleton key={i} />
            ))}
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map(agent => (
              <div key={agent.id} className="gsap-agent-card" style={{ willChange: "transform, opacity" }}>
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-background rounded-2xl border border-border">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-muted-foreground/60" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No agents found</h3>
            <p className="text-muted-foreground">Check back soon to meet our growing team.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 text-brand font-bold hover:underline"
            >
              Reload Team
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
