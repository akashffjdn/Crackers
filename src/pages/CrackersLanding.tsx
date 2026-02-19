import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Categories from '../components/Categories';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const CrackersLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Categories />
        <Features />
        <Testimonials />
        <HowItWorks />

        <CTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CrackersLanding;
