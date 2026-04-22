import React from 'react';
import { MapPin } from 'lucide-react';
import { LocationArea } from '../../types';

interface LocationCardProps {
  location: LocationArea;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div
      className="
        flex-shrink-0 w-full md:w-80 h-64
        bg-white rounded-lg shadow-md
        p-6 flex flex-col justify-between
        hover:shadow-lg transition-shadow duration-300
        will-change-transform
      "
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {/* Header with icon */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {location.name}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {location.description}
        </p>
      </div>

      {/* Footer with property count */}
      <div className="text-xs text-gray-500 font-medium">
        {location.propertyCount} properties
      </div>
    </div>
  );
};
