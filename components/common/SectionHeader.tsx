
import React from 'react';

interface SectionHeaderProps {
  subtitle: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  subtitle, 
  title, 
  description, 
  align = 'center',
  className = "mb-[40px] md:mb-[60px]",
  light = false
}) => {
  return (
    <div className={`text-${align} ${className} ${align === 'center' ? 'max-w-4xl mx-auto' : ''}`}>
      <span className="text-[13px] font-bold tracking-[3px] text-brand uppercase mb-3 block heading-serif">
        {subtitle}
      </span>
      <h2 className={`text-3xl md:text-4xl lg:text-5xl heading-serif ${light ? 'text-white' : 'text-foreground'} mb-6 leading-tight`}>
        {title}
      </h2>
      {description && (
        <p className={`text-[18px] ${light ? 'text-gray-300' : 'text-muted-foreground'} font-normal leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};
