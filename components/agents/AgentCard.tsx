import React from 'react';
import { Link } from 'react-router-dom';
import { Agent } from '../../types';
import { ArrowRight, Award } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <Link 
      to={`/agents/${agent.id}`}
      className="block bg-background rounded-2xl border border-border shadow-sm hover:shadow-xl transition-[box-shadow,border-color] duration-300 overflow-hidden flex flex-col group h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <div className="w-32 h-32 rounded-full mb-6 relative">
          <img 
            src={getOptimizedImageUrl(agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 400)} 
            alt={`${agent.name}, Real Estate Agent`}
            loading="lazy"
            className="w-full h-full object-cover rounded-full border-4 border-gray-50 shadow-md"
          />
          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-2 border-white">
            <Award size={16} />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-1">{agent.name}</h3>
        <p className="text-brand font-bold text-sm uppercase tracking-wide mb-4">{agent.yearsOfExperience} Years Experience</p>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 px-2">
          {agent.bio}
        </p>
        
        <div className="mt-auto pt-6 border-t border-gray-50 w-full">
          <span className="w-full py-2 flex items-center justify-center gap-2 text-brand font-bold group-hover/link:translate-x-1 transition-transform">
            View Profile <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};
