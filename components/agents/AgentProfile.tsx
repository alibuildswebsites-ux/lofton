
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { getAgentById } from '../../lib/firebase/firestore';
import { Agent } from '../../types';
import { Phone, Mail, Award, ArrowLeft, Facebook, Linkedin, Instagram, BadgeCheck } from 'lucide-react';
import { updateSEO, getOptimizedImageUrl } from '../../utils';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AgentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getAgentById(id);
          setAgent(data);
          if (data) {
            updateSEO({
              title: `${data.name} | Real Estate Agent at Lofton Realty`,
              description: `Contact ${data.name}, a licensed real estate agent with ${data.yearsOfExperience} years of experience. ${data.bio.substring(0, 100)}...`,
              image: data.photo,
              url: `https://lofton-psi.vercel.app/agents/${data.id}`,
              type: 'profile'
            });
          }
        }
      } catch (err) {
        console.error('Failed to load agent:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-accent flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Agent Not Found</h1>
          <Link to="/agents" className="text-brand font-bold hover:underline">View All Agents</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans bg-accent min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          
          <Link 
            to="/agents" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand font-bold mb-8 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft size={16} /> Back to Team
          </Link>

          <div className="bg-background rounded-3xl shadow-sm border border-border overflow-hidden">
            <div className="grid md:grid-cols-[1fr_2fr] gap-0">
              
              {/* Photo Column */}
              <div className="bg-muted relative h-96 md:h-auto">
                <img 
                  src={getOptimizedImageUrl(agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 800)} 
                  alt={`Profile photo of ${agent.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Column */}
              <div className="p-8 md:p-12">
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{agent.name}</h1>
                    <span className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <BadgeCheck size={14} /> Licensed Agent
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium text-lg">License #{agent.licenseNumber} • {agent.yearsOfExperience} Years Experience</p>
                </div>

                <div className="prose prose-gray max-w-none mb-10 text-muted-foreground leading-relaxed">
                  <p>{agent.bio}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-brand/30 hover:bg-brand-light/10 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-muted-foreground/60 uppercase">Phone</span>
                      <span className="block font-bold text-foreground">{agent.phone}</span>
                    </div>
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-brand/30 hover:bg-brand-light/10 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-muted-foreground/60 uppercase">Email</span>
                      <span className="block font-bold text-foreground truncate">{agent.email}</span>
                    </div>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-border">
                  <div className="flex gap-4">
                    {agent.socialLinks?.facebook && (
                      <a 
                        href={agent.socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`${agent.name} on Facebook`}
                        className="text-muted-foreground/60 hover:text-[#1877F2] transition-colors"
                      >
                        <Facebook size={24} />
                      </a>
                    )}
                    {agent.socialLinks?.instagram && (
                      <a 
                        href={agent.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${agent.name} on Instagram`}
                        className="text-muted-foreground/60 hover:text-[#E4405F] transition-colors"
                      >
                        <Instagram size={24} />
                      </a>
                    )}
                    {agent.socialLinks?.linkedin && (
                      <a 
                        href={agent.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${agent.name} on LinkedIn`}
                        className="text-muted-foreground/60 hover:text-[#0A66C2] transition-colors"
                      >
                        <Linkedin size={24} />
                      </a>
                    )}
                  </div>

                  <Link 
                    to="/contact-us"
                    aria-label={`Contact Lofton Realty about ${agent.name}`}
                    className="bg-foreground text-background px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-charcoal/20 w-full sm:w-auto text-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
