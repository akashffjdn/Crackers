import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent();

  const heroTitle = getContentValue('heroTitle') || 'Light Up Your Celebrations';
  const heroSubtitle = getContentValue('heroSubtitle') || 'Premium quality crackers from Sivakasi. Safe, colorful, and guaranteed to make your festivals unforgettable.';
  const heroImage = getContentMetadata('heroImage');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-900">
      {/* Full-screen background image with blur */}
      <div className="absolute inset-0">
        <img
          src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80"}
          alt={heroImage?.altText || "Premium festival crackers display"}
          className="w-full h-full object-cover"
        />

        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40" />

        {/* Dark gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Centered content */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-[11px] font-semibold text-white tracking-[0.2em] uppercase">Festival Season 2025</span>
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-[-0.03em] mb-8"
        >
          <span className="text-white block drop-shadow-2xl">Light Up</span>
          <span className="block bg-gradient-to-r from-accent via-[#ff6b7a] to-gold bg-clip-text text-transparent drop-shadow-2xl">
            Your Festival
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg"
        >
          {heroSubtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            to="/shop"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-accent text-white text-base font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(230,57,70,0.5)] hover:scale-[1.05] shadow-xl"
          >
            <span className="relative z-10">Shop Collection</span>
            <svg
              className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-[#ff4757] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            to="/festival-collections"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/30 text-white text-base font-semibold rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-xl shadow-xl"
          >
            View Collections
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-12 lg:gap-20"
        >
          {[
            { number: '500+', label: 'Premium Products' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '15+', label: 'Years Legacy' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-xl">{stat.number}</div>
              <div className="text-xs md:text-sm text-white/80 tracking-wider uppercase drop-shadow-lg">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 backdrop-blur-sm"
        >
          <motion.div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
