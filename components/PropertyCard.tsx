import React, { useState, MouseEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Property } from '../types';
import { getOptimizedImageUrl } from '../utils';
import { saveProperty, unsaveProperty } from '../lib/firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if property is saved on mount
  useEffect(() => {
    let isMounted = true;

    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (isMounted && userDoc.exists()) {
            const savedProps = userDoc.data().savedProperties || [];
            setIsFavorite(savedProps.includes(property.id));
          }
        } catch (error) {
          if (isMounted) console.error("Error checking favorite status:", error);
        }
      } else {
        if (isMounted) setIsFavorite(false);
      }
    };

    checkFavoriteStatus();

    return () => {
      isMounted = false;
    };
  }, [user, property.id]);

  const hasImages = property.images && property.images.length > 0;

  const handlePrevImage = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasImages) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
    setImageError(false);
  };

  const handleNextImage = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasImages) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
    setImageError(false);
  };

  const toggleFavorite = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic UI update
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    
    try {
      if (isFavorite) {
        // Was favorite, so unsave
        await unsaveProperty(user.uid, property.id);
      } else {
        // Was not favorite, so save
        await saveProperty(user.uid, property.id);
      }
    } catch (error) {
      // Revert on error
      setIsFavorite(!newStatus);
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCardClick = () => {
    navigate(`/property-listings/${property.id}`);
  };

  const isList = viewMode === 'list';

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
      tabIndex={0}
      className={`group bg-background rounded-[20px] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-[box-shadow,border-color] duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 flex ${isList ? 'flex-col md:flex-row' : 'flex-col'}`}
      role="article"
      aria-label={`View details for ${property.address}`}
    >
      {/* Image Carousel Area */}
      <div className={`relative overflow-hidden bg-muted ${isList ? 'w-full md:w-[320px] h-[240px] md:h-auto shrink-0' : 'h-[240px] lg:h-[260px] w-full'}`}>
         
         {/* Images */}
         {!imageError && hasImages ? (
           property.images.map((img, idx) => (
             <div 
               key={idx}
               className={`absolute inset-0 transition-opacity duration-500 will-change-opacity ${idx === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
             >
               {/* Only render current and adjacent images */}
               {(idx === currentImageIndex || idx === (currentImageIndex + 1) % property.images.length || idx === (currentImageIndex - 1 + property.images.length) % property.images.length) && (
                 <img
                   src={getOptimizedImageUrl(img, 800)}
                   alt={`Property at ${property.address} - View ${idx + 1}`}
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                    loading="lazy"
                   onError={() => setImageError(true)}
                 />
               )}
             </div>
           ))
         ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground/60">
             <ImageOff size={48} className="mb-2" />
             <span className="text-sm font-medium">Image not available</span>
           </div>
         )}
         
         {/* Status Badge */}
         <div className="absolute top-4 left-4 z-20">
           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-sm ${
             property.status === 'New Listing' ? 'bg-blue-600' :
             property.status === 'Pending' ? 'bg-orange-500' :
             property.status === 'Price Drop' ? 'bg-red-500' :
             'bg-brand'
           }`}>
             {property.status || 'For Sale'}
           </span>
         </div>

         {/* Carousel Controls */}
         {hasImages && property.images.length > 1 && !imageError && (
           <>
             <button 
               onClick={handlePrevImage}
               className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 p-2 rounded-full text-foreground shadow-md hover:bg-background hover:text-brand transition-all duration-200 z-20 opacity-100 translate-x-0 lg:opacity-0 lg:-translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0"
               aria-label="Previous image"
             >
               <ChevronLeft size={18} />
             </button>
             <button 
               onClick={handleNextImage}
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 p-2 rounded-full text-foreground shadow-md hover:bg-background hover:text-brand transition-all duration-200 z-20 opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0"
               aria-label="Next image"
             >
               <ChevronRight size={18} />
             </button>
             
             {/* Dots */}
             <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20" aria-hidden="true">
               {property.images.map((_, idx) => (
                 <div 
                   key={idx} 
                   className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? 'bg-background' : 'bg-background/50'}`} 
                 />
               ))}
             </div>
           </>
         )}
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

         {/* Favorite Button */}
         <button 
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            className={`absolute top-4 right-4 z-20 bg-background/90 backdrop-blur p-2 rounded-full shadow-md hover:bg-background transition-all duration-200 
              ${isFavorite ? 'text-red-500 opacity-100' : 'text-muted-foreground hover:text-red-500'} 
              ${!isFavorite ? 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100' : ''}`}
         >
            <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
         </button>
      </div>

      {/* Content */}
      <div className={`p-6 flex flex-col justify-between flex-grow ${isList ? 'py-6 px-8' : ''}`}>
        <div>
          <div className="flex justify-between items-start mb-2">
             <h3 className="text-2xl font-bold text-foreground">
               <span className="sr-only">Price: </span>
               ${property.price.toLocaleString()}
             </h3>
          </div>
          <p className="text-foreground font-semibold text-lg mb-1 truncate">{property.address}</p>
          <p className="text-muted-foreground/60 text-sm mb-6 flex items-center gap-1">
            <MapPin size={14} className="text-brand" /> {property.location || property.city + ', ' + property.state}
          </p>

          <div className="flex items-center gap-6 text-muted-foreground text-sm border-t border-border pt-4 mb-4">
            <div className="flex items-center gap-2">
              <Bed size={18} className="text-muted-foreground/60" /> 
              <span><strong className="text-foreground">{property.beds}</strong> Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={18} className="text-muted-foreground/60" />
              <span><strong className="text-foreground">{property.baths}</strong> Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize size={18} className="text-muted-foreground/60" />
              <span><strong className="text-foreground">{property.sqft.toLocaleString()}</strong> Sqft</span>
            </div>
          </div>
        </div>
        
        <Link
          to={`/property-listings/${property.id}`}
          onClick={(e) => e.stopPropagation()}
          aria-label={`View details for ${property.address}`}
          className="w-full mt-auto border border-border rounded-lg py-3 text-sm font-bold text-foreground hover:bg-foreground hover:text-white hover:border-charcoal transition-colors text-center inline-block touch-manipulation"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
