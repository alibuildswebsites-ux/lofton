import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { SectionErrorBoundary } from './SectionErrorBoundary';
import { updateSEO, injectJSONLD } from '../utils';

// Static imports to remove lazy loading
import { StatsBar } from './StatsBar';
import { ServicesSection } from './ServicesSection';
import { FeaturedProperties } from './FeaturedProperties';
import { TrustSection } from './TrustSection';
import { LocationsSection } from './LocationsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { ContactFormSection } from './ContactFormSection';
import { Footer } from './Footer';

const LoftonRealtyHome = () => {
  useEffect(() => {
    updateSEO({
      title: "Lofton Realty | Premium Real Estate Broker Houston & Gulf Coast",
      description: "Established in 2006, Lofton Realty is a premium real estate brokerage serving Houston, Galveston, Austin, Louisiana, Mississippi, and Florida. Expert guidance for buyers, sellers, and investors with 24/7 personalized service.",
      url: "https://lofton-psi.vercel.app/",
      image: "https://lofton-psi.vercel.app/og-image.svg"
    });

    injectJSONLD({
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Lofton Realty",
      "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      "description": "Houston's trusted real estate partner since 2006 for buying, selling, and investing across the Gulf Coast.",
      "url": "https://lofton-psi.vercel.app/",
      "telephone": "713-203-7661",
      "email": "Info@LoftonRealty.com",
      "foundingDate": "2006",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Business Blvd",
        "addressLocality": "Houston",
        "addressRegion": "TX",
        "postalCode": "77002",
        "addressCountry": "US"
      },
      "areaServed": [
        { "@type": "City", "name": "Houston" },
        { "@type": "City", "name": "Galveston" },
        { "@type": "City", "name": "Austin" },
        { "@type": "State", "name": "Texas" },
        { "@type": "State", "name": "Louisiana" },
        { "@type": "State", "name": "Mississippi" },
        { "@type": "State", "name": "Florida" }
      ],
      "knowsAbout": [
        "Residential Real Estate",
        "Luxury Property Marketing",
        "Investment Properties",
        "Market Analysis",
        "First-Time Home Buyers",
        "Seller Representation"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500"
      }
    });
  }, []);

  return (
    <div className="font-sans text-foreground bg-background selection:bg-brand selection:text-white">
      <Navbar />
      <main>
        <div className="border-b border-border/10">
          <Hero />
        </div>
        
        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <StatsBar />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <ServicesSection />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <FeaturedProperties />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <TrustSection />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <LocationsSection />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <TestimonialsSection />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <div className="border-b border-border/10">
            <ContactFormSection />
          </div>
        </SectionErrorBoundary>

        {/* AI SEO Definition Block */}
        <section className="py-12 bg-muted/30 border-b border-border/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px]">
            <div className="max-w-3xl">
              <h2 className="heading-serif text-2xl mb-4">About Lofton Realty</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lofton Realty is a premier real estate brokerage founded in 2006. We specialize in residential property sales, luxury real estate marketing, and strategic investment consulting across the Gulf Coast. Our areas of expertise include the Houston metropolitan area, Galveston island, the Austin market, and expansive regions throughout Louisiana, Mississippi, and Florida. With a commitment to 24/7 personalized service, Lofton Realty bridges the gap between buyers, sellers, and investors through expert market analysis and dedicated representation.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default LoftonRealtyHome;