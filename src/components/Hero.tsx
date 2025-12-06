import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaArrowRight } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent();

  const heroTitle = getContentValue('heroTitle') || 'Light Up Your Festival!';
  const heroSubtitle = getContentValue('heroSubtitle') || 'Premium quality crackers from Sivakasi. Safe, colorful, and guaranteed to make your celebrations unforgettable!';
  const ratingText = getContentValue('heroRatingText') || 'Rated 4.9/5 by 10,000+ customers';
  const primaryCTA = getContentValue('heroCtaPrimary') || 'Shop Now 🛒';
  const secondaryCTA = getContentValue('heroCtaSecondary') || 'Watch Demo';
  const stat1Number = getContentValue('heroStat1Number') || '500+';
  const stat1Label = getContentValue('heroStat1Label') || 'Products';
  const stat2Number = getContentValue('heroStat2Number') || '10K+';
  const stat2Label = getContentValue('heroStat2Label') || 'Happy Customers';
  const stat3Number = getContentValue('heroStat3Number') || '15+';
  const stat3Label = getContentValue('heroStat3Label') || 'Years Experience';
  const specialOffer = getContentValue('heroSpecialOffer') || '🎉 Festival Special!';
  const heroImage = getContentMetadata('heroImage');

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl animate-pulse-slow opacity-20">✨</div>
        <div className="absolute top-40 right-32 text-5xl animate-bounce-slow opacity-20">🎆</div>
        <div className="absolute bottom-32 left-40 text-6xl animate-pulse-slow opacity-20">🎇</div>
        <div className="absolute bottom-20 right-20 text-4xl animate-bounce-slow opacity-20">✨</div>
        <div className="absolute top-1/2 left-1/4 text-5xl animate-pulse opacity-15">🎊</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce-slow opacity-15">🎉</div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 via-orange-600/80 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Rating Badge */}
            <div className="flex items-center justify-center lg:justify-start space-x-1 mb-6">
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
                <span className="ml-2 text-yellow-100 text-sm font-medium">{ratingText}</span>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-display leading-tight mb-6 animate-slide-up">
              <span className="block">{heroTitle}</span>
              <span className="block text-yellow-300 mt-2">Celebrations!</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-orange-100 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-red-700 rounded-2xl text-lg font-bold hover:from-yellow-300 hover:to-orange-300 transition-all transform hover:scale-105 shadow-2xl hover:shadow-glow-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{primaryCTA}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <button className="group inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white hover:text-red-600 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm bg-white/10">
                <FaPlay className="text-sm" />
                <span>{secondaryCTA}</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-center lg:text-left bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">{stat1Number}</div>
                <div className="text-orange-200 text-sm font-medium">{stat1Label}</div>
              </div>
              <div className="text-center lg:text-left bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">{stat2Number}</div>
                <div className="text-orange-200 text-sm font-medium">{stat2Label}</div>
              </div>
              <div className="text-center lg:text-left bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">{stat3Number}</div>
                <div className="text-orange-200 text-sm font-medium">{stat3Label}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative z-10">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-3xl blur-3xl transform scale-110"></div>
              
              {/* Image Container */}
              <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"}
                  alt={heroImage?.altText || "Colorful Diwali crackers and fireworks display"}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-red-700 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl animate-bounce-slow border-2 border-white">
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-xs" />
                    <span>{specialOffer}</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl">
                  <div className="text-3xl mb-2">🎆</div>
                  <div className="text-white text-sm font-semibold">Premium Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;