
import React from 'react';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const TestPreloader = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center pt-20">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-charcoal mb-8">Preloader Preview</h2>
          <LoadingSpinner label="Lofton Realty" size="lg" loop={true} />
          <p className="mt-8 text-gray-500 text-center text-sm">
            This is "The Architect" preloader in loop mode.<br/>
            It sketches a minimalist house to represent your brand.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestPreloader;
