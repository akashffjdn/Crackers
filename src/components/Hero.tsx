import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaArrowRight, FaSparkles } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const stats = [
    { number: stat1Number, label: stat1Label },
    { number: stat2Number, label: stat2Label },
    { number: stat3Number, label: stat3Label }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white overflow-hidden pt-24">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-7xl animate-float">✨</div>
        <div className="absolute top-32 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>🎆</div>
        <div className="absolute bottom-20 left-32 text-6xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
        <div className="absolute bottom-32 right-10 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute top-1/2 left-1/4 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute top-1/3 right-1/3 text-4xl animate-float" style={{ animationDelay: '2.5s' }}>💫</div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 via-transparent to-orange-600/50"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-900/20"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`text-center lg:text-left ${isVisible ? 'animate-slide-left' : 'opacity-0'}`}>
            {/* Rating Badge */}
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6 animate-scale-in">
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
                <span className="ml-2 text-yellow-200 font-semibold">{ratingText}</span>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
              <span className="block bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-gradient">
                {heroTitle}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-orange-100 mb-10 max-w-lg leading-relaxed animate-slide-up stagger-1">
              {heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-slide-up stagger-2">
              <Link
                to="/shop"
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-8 py-4 rounded-full text-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{primaryCTA}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <button className="group relative overflow-hidden border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm bg-white/10">
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <FaPlay className="relative z-10" />
                <span className="relative z-10">{secondaryCTA}</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-center animate-slide-up stagger-3">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-orange-200 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className={`relative ${isVisible ? 'animate-slide-right' : 'opacity-0'}`}>
            <div className="relative z-10">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-3xl blur-3xl animate-pulse-glow"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"}
                    alt={heroImage?.altText || "Colorful Diwali crackers and fireworks display"}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/50 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-red-700 px-6 py-3 rounded-full font-bold text-sm shadow-2xl animate-bounce border-4 border-white">
                  <div className="flex items-center space-x-2">
                    <FaSparkles className="animate-spin" style={{ animationDuration: '3s' }} />
                    <span>{specialOffer}</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-8 top-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl animate-float">
                <div className="text-3xl mb-2">🎆</div>
                <div className="text-sm font-semibold">Premium Quality</div>
              </div>
              
              <div className="absolute -right-8 bottom-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-3xl mb-2">🚚</div>
                <div className="text-sm font-semibold">Fast Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
