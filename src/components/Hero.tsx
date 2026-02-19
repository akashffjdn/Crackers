import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaStar, FaGift } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroTitle = getContentValue('heroTitle') || 'Light Up Your Celebrations';
  const heroSubtitle = getContentValue('heroSubtitle') || 'Premium quality crackers from Sivakasi. Safe, colorful, and guaranteed to make your festivals unforgettable.';
  const heroImage = getContentMetadata('heroImage');

  const slides = [
    {
      badge: 'Festival Season 2025',
      title1: "Let's Celebrate",
      title2: 'Together with',
      title3: 'Premium Crackers',
      subtitle: 'Experience the finest Sivakasi crackers with guaranteed safety, vibrant colors, and unforgettable moments for your festive celebrations.',
      image: heroImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80"
    },
    {
      badge: 'Special Offer',
      title1: 'Flat 30% OFF',
      title2: 'on Bulk Orders',
      title3: 'This Festival',
      subtitle: 'Get exclusive discounts on combo packs and wholesale purchases. Perfect for celebrations, events, and large gatherings.',
      image: "https://images.unsplash.com/photo-1592843997881-cab3860b1067?w=1920&h=1080&fit=crop&q=80"
    },
    {
      badge: 'Premium Quality',
      title1: "Sivakasi's",
      title2: 'Finest Quality',
      title3: 'Crackers',
      subtitle: '500+ varieties, 15+ years of trusted celebration moments. Government licensed and safety certified products.',
      image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=1920&h=1080&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-900 pt-16">
      {/* Full-screen background images with transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={currentSlide.image}
            alt="Festival crackers"
            className="w-full h-full object-cover"
          />
          {/* Multi-layer overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-accent/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      {/* Centered content */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-xl shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span className="text-xs font-bold text-accent tracking-[0.2em] uppercase">{currentSlide.badge}</span>
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="block text-white drop-shadow-2xl">{currentSlide.title1}</span>
              <span className="block text-white drop-shadow-2xl">{currentSlide.title2}</span>
              <span className="block bg-gradient-to-r from-accent via-[#ff6b7a] to-gold bg-clip-text text-transparent drop-shadow-2xl">
                {currentSlide.title3}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
              {currentSlide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(230,57,70,0.6)] hover:scale-105 shadow-xl"
              >
                <FaShoppingBag className="text-lg" />
                <span className="relative z-10">Shop Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent to-[#ff4757]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <Link
                to="/festival-collections"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-xl shadow-xl"
              >
                <FaGift />
                <span>View Collections</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
              {[
                { value: '15+', label: 'years experience' },
                { value: '26K', label: 'projects success' },
                { value: '98%', label: 'satisfied rate' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-xl">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/80 tracking-wider uppercase drop-shadow-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;
