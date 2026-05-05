import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, 
  Linkedin, MessageSquare,
  Building, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { STATS } from '../data';
import { getOptimizedImageUrl, updateSEO } from '../utils';
import { SharedContactForm } from './SharedContactForm';
import { COMPANY_INFO } from '../lib/constants';
import gsap from 'gsap';

export const ContactPage = () => {
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateSEO({
      title: "Contact Us | Lofton Realty",
      description: "Get in touch with Lofton Realty. Call, email, or visit us for your Houston real estate needs. Available 24/7.",
      url: "https://lofton-psi.vercel.app/contact-us"
    });
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    const initGSAP = () => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray('.gsap-contact-card');
        
        gsap.set(cards, { 
          opacity: 0, 
          y: 50
        });

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.2
        });
      }, cardsRef);
      return ctx;
    };

    let ctx: gsap.Context;

    const handleReady = () => {
      if (ctx) ctx.revert();
      ctx = initGSAP();
    };

    if ((window as any).appReady) {
      const timer = setTimeout(() => {
        ctx = initGSAP();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener('appReady', handleReady);
    }

    return () => {
      if (ctx) ctx.revert();
      window.removeEventListener('appReady', handleReady);
    };
  }, []);

  return (
    <div className="font-sans bg-accent min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-background overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center" 
          style={{ backgroundImage: `url(${getOptimizedImageUrl('https://images.unsplash.com/photo-1497366216548-37526070297c', 1200)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/90 to-charcoal-dark/60" />
        
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand/20 border border-brand/40 text-brand font-bold text-sm tracking-widest uppercase mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Let's Start the Conversation
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Available 24/7 for your real estate needs. Whether you're buying, selling, or just have questions, we're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section ref={cardsRef} className="relative z-20 -mt-16 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              icon: Phone, title: 'Call Us', detail: COMPANY_INFO.PHONE, sub: '24/7 Availability', 
              action: 'Call Now', href: `tel:${COMPANY_INFO.PHONE_RAW}` 
            },
            { 
              icon: Mail, title: 'Email Us', detail: COMPANY_INFO.EMAIL, sub: 'Response within 1 hour', 
              action: 'Send Email', href: `mailto:${COMPANY_INFO.EMAIL}` 
            },
            { 
              icon: MapPin, title: 'Visit Our Office', detail: 'Houston, Texas Area', sub: 'By appointment', 
              action: 'Get Directions', href: 'https://maps.google.com' 
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="gsap-contact-card bg-background p-8 rounded-2xl shadow-lg border border-border flex flex-col items-center text-center group hover:border-brand/30 transition-[box-shadow,border-color] duration-300 opacity-0"
            >
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center text-brand mb-4 transition-colors duration-300">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-lg font-medium text-foreground mb-1">{item.detail}</p>
              <p className="text-sm text-muted-foreground mb-6">{item.sub}</p>
              <a 
                href={item.href}
                target={item.action === 'Get Directions' ? "_blank" : undefined}
                rel={item.action === 'Get Directions' ? "noopener noreferrer" : undefined}
                className="mt-auto text-brand font-bold border-b-2 border-brand/20 hover:border-brand pb-0.5 transition-colors"
              >
                {item.action}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-16">
          
          {/* Left Column: Form */}
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Send us a Message</h2>
              <p className="text-muted-foreground">Fill out the form below and a member of our team will get back to you shortly.</p>
            </div>

            <div className="bg-background p-8 md:p-10 rounded-3xl shadow-sm border border-border">
               <SharedContactForm variant="light" />
            </div>
          </div>

          {/* Right Column: Info & Team */}
          <div className="space-y-12">
            
            {/* Team Section */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Building size={20} className="text-brand" /> Meet the Team
              </h3>
              
              {/* Jared Card */}
              <div className="bg-background p-6 rounded-2xl shadow-sm border border-border mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Jared Lofton" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">Jared Lofton, MBA</h4>
                    <p className="text-brand text-sm font-bold uppercase tracking-wide">Founder & Broker</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  Real Estate Broker with 19+ years experience. MBA in Finance. Former Financial Planner. Philosophy: Clients come first.
                </p>
                <div className="flex gap-3">
                  <a href={COMPANY_INFO.SOCIAL.LINKEDIN} className="p-2 text-muted-foreground/60 hover:text-blue-600 transition-colors bg-accent rounded-lg" target="_blank" rel="noopener noreferrer"><Linkedin size={18} /></a>
                  <a href={`mailto:${COMPANY_INFO.EMAIL}`} className="p-2 text-muted-foreground/60 hover:text-brand transition-colors bg-accent rounded-lg"><Mail size={18} /></a>
                </div>
              </div>

              {/* Placeholder Card */}
              <div className="bg-accent p-6 rounded-2xl border border-border border-dashed text-center">
                 <p className="text-muted-foreground/60 text-sm font-medium">Looking to join our team?</p>
                 <Link to="/contact-us" className="text-brand font-bold text-sm hover:underline">Get in Touch</Link>
              </div>
            </div>

            {/* Office Hours */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock size={20} className="text-brand" /> Office Hours
              </h3>
              <div className="bg-background p-6 rounded-2xl shadow-sm border border-border space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Mon - Fri</span>
                    <span className="font-bold text-foreground">8:00 AM - 8:00 PM</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Saturday</span>
                    <span className="font-bold text-foreground">9:00 AM - 6:00 PM</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Sunday</span>
                    <span className="font-bold text-foreground">12:00 PM - 5:00 PM</span>
                 </div>
                 <div className="pt-3 mt-3 border-t border-border flex items-center gap-2 text-brand font-bold text-sm">
                    <CheckCircle2 size={16} /> 24/7 Emergency Support Available
                 </div>
              </div>
            </div>

            {/* FAQ Links */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-brand" /> Common Questions
              </h3>
              <div className="space-y-3">
                {[
                   { label: "Read our Buyer's Guide", to: '/buyers-guide' },
                   { label: "Read our Seller's Guide", to: '/sellers-guide' },
                   { label: 'View Current Listings', to: '/property-listings' },
                ].map((link, i) => (
                  <Link 
                    key={i}
                    to={link.to}
                    className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-brand/30 hover:shadow-md transition-[box-shadow,border-color] duration-300 group text-left"
                  >
                    <span className="text-muted-foreground font-medium group-hover:text-foreground">{link.label}</span>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-brand" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map & Service Area */}
      <section className="bg-background py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Serving Houston & Beyond</h2>
            <p className="text-muted-foreground">Visit our headquarters or connect with us in any of our 6 major markets.</p>
          </div>

          <div className="max-w-5xl mx-auto">
             {/* Map Embed */}
             <div className="rounded-3xl overflow-hidden shadow-lg border border-border h-[450px] relative bg-muted w-full" role="region" aria-label="Map showing Lofton Realty service area in Houston, TX">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443088.0518320649!2d-95.68266224375!3d29.817478200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1652822453673!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lofton Realty Office Location"
                ></iframe>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-background py-16 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-brand mb-3">
                  <stat.icon size={32} />
                </div>
                <div className="text-3xl font-extrabold text-foreground mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-muted-foreground/60 text-sm uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-500">
             {['BBB Accredited', 'Realtor.com Partner', 'HAR.com Member', 'Equal Housing'].map((badge, i) => (
               <div key={i} className="px-4 py-2 border border-white/30 rounded text-foreground text-xs font-bold uppercase tracking-widest">
                 {badge}
               </div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
