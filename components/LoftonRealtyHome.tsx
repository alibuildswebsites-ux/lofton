import React, { useEffect } from 'react';
import { motion } from 'motion/react';
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

        {/* About Section Redesign - Split Layout */}
        <section className="py-[100px] bg-white overflow-hidden" id="about">
          <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" 
                    alt="Luxury Home Interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-brand/5 rounded-full blur-3xl z-0" />
                <div className="absolute -top-6 -left-6 w-48 h-48 bg-brand/10 rounded-full blur-2xl z-0" />
                
                {/* Stats Badge */}
                <div className="absolute bottom-10 right-[-20px] bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100">
                  <p className="text-4xl font-bold text-brand mb-1">2006</p>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Established</p>
                </div>
              </motion.div>

              {/* Content Side */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <span className="text-[13px] font-bold tracking-[3px] text-brand uppercase mb-4 block heading-serif">
                  Established in 2006
                </span>
                <h2 className="text-4xl md:text-5xl heading-serif text-foreground mb-8 leading-tight">
                  Bridging the Gap Between <br /> Dreams and Reality
                </h2>
                
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Lofton Realty is a premier real estate brokerage dedicated to providing a premium experience across the Gulf Coast. From the heart of Houston to the shores of Florida, we bring nearly two decades of expertise to every transaction.
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                    Whether you're buying your first home, selling a luxury estate, or expanding an investment portfolio, our mission is to provide the expert guidance and personalized service you deserve—available 24/7 to ensure your success.
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                    <div>
                      <p className="text-3xl font-bold text-foreground mb-1">500+</p>
                      <p className="text-sm font-medium text-muted-foreground">Families Trusted Us</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground mb-1">6</p>
                      <p className="text-sm font-medium text-muted-foreground">Regions Served</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default LoftonRealtyHome;