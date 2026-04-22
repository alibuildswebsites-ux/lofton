import React from 'react';
import { MapPin } from 'lucide-react';
import { LocationArea } from '../../types';

interface LocationCardProps {
  location: LocationArea;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const cardDescription = location.longDescription || location.description;

  return (
    <div
      className="
        flex-shrink-0 w-full md:w-80 h-64
        bg-background rounded-lg shadow-md
        p-6 flex flex-col
        hover:shadow-lg transition-shadow duration-300
        will-change-transform
      "
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-light">
            <MapPin className="h-4 w-4 text-brand-dark" />
          </span>
          <h3 className="text-xl font-semibold text-foreground">
            {location.name}
          </h3>
        </div>

        <p
          className="text-muted-foreground text-sm leading-relaxed"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {cardDescription}
        </p>
      </div>
    </div>
  );
};
