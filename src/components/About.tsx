import React from 'react';
import { useContent } from '../context/ContentContext';

const About: React.FC = () => {
  const { getContentValue } = useContent();

  const companyName = getContentValue('companyName') || 'Crackers';
  const aboutText = getContentValue('aboutDescription') ||
    'Rooted in Sivakasi — the fireworks capital of India — we\'ve been crafting premium crackers for over 15 years. Every product is made with care, tested for safety, and designed to create unforgettable celebrations.';

  return (
    <section className="section bg-surface-900">
      <div className="section-container">
        <div className="section-divider mb-16" />

        <div className="max-w-3xl mx-auto text-center">
          <p className="label mb-3">About Us</p>
          <h2 className="heading-md mb-6">
            Crafted with care,{' '}
            <span className="text-gradient">since 2009.</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto mb-10">
            {aboutText}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { number: '15+', label: 'Years of Experience' },
              { number: '500+', label: 'Product Varieties' },
              { number: '10K+', label: 'Happy Families' },
            ].map((stat, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-2xl font-bold text-gradient mb-1">{stat.number}</div>
                <div className="text-xs text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
