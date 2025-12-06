import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Features from '../components/Features';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const CrackersLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-orange-50/30 to-red-50/30">
      <Header />
      <main className="overflow-hidden">
        <Hero />
        <Categories />
        <Features />
        <About />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default CrackersLanding;
