
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StackedLocations } from './StackedLocations';

const CoveragePreview = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <StackedLocations />
      </main>
      <Footer />
    </div>
  );
};

export default CoveragePreview;
