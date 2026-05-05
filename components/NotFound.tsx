import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { updateSEO } from '../utils';

export const NotFound = () => {
  useEffect(() => {
    updateSEO({
      title: "Page Not Found | Lofton Realty",
      description: "The page you're looking for doesn't exist. Browse our property listings or contact us.",
      url: "https://lofton-psi.vercel.app/404"
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-accent">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-20" role="main">
        <div className="bg-red-50 p-6 rounded-full mb-6 ring-8 ring-red-50/50">
          <AlertCircle className="text-red-400 w-12 h-12" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Home size={20} aria-hidden="true" /> Return Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};