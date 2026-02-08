
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LocationsSection } from './LocationsSection';

const CoveragePreview = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <LocationsSection />
      </main>
      <Footer />
    </div>
  );
};

export default CoveragePreview;
