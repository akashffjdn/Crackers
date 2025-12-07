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
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50/50">
      <Header />
      <main className="relative">
        {/* Hero Section - Full Viewport */}
        <Hero />
        
        {/* Categories Section */}
        <Categories />
        
        {/* Features Section */}
        <Features />
        
        {/* About Section */}
        <About />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default CrackersLanding;
