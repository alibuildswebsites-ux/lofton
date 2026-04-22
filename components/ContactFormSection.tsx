import React from 'react';
import { SharedContactForm } from './SharedContactForm';

export const ContactFormSection = () => {
  return (
    <section className="bg-background py-[60px] md:py-[80px] lg:py-[100px]" id="contact">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[13px] font-bold tracking-[2px] text-brand uppercase mb-3 block">Contact Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight">Get In Touch</h2>
          <p className="text-muted-foreground text-lg">
            Have questions about a property or ready to sell? Send us a message below.
          </p>
        </div>

        <div className="bg-accent rounded-[24px] p-8 md:p-10 border border-border shadow-sm relative overflow-hidden">
           <SharedContactForm variant="light" />
        </div>
      </div>
    </section>
  );
};