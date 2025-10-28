import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar } from 'react-icons/fa';
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const Hero: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent(); // ✅ Add this hook

  // ✅ Get dynamic content with fallbacks
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
    <section id="home" className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">✨</div>
        <div className="absolute top-32 right-20 text-4xl animate-bounce">🎆</div>
        <div className="absolute bottom-20 left-32 text-5xl animate-pulse">🎇</div>
        <div className="absolute bottom-32 right-10 text-3xl animate-bounce">✨</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
              <span className="ml-2 text-yellow-200">{ratingText}</span> {/* ✅ Dynamic rating text */}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              {/* ✅ Split title to maintain the styling structure */}
              {heroTitle.includes('Festival') ? (
                <>
                  {heroTitle.replace('Festival!', '').trim()}
                  {/* <span className="text-yellow-300 block">Festival!</span> */}
                </>
              ) : (
                heroTitle
              )}
            </h1>
            
            <p className="text-xl text-orange-100 mb-8 max-w-lg">
              {heroSubtitle} {/* ✅ Dynamic subtitle */}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="bg-yellow-500 text-red-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg inline-block text-center"
              >
                {primaryCTA} {/* ✅ Dynamic primary CTA */}
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-red-600 transition-all flex items-center justify-center space-x-2">
                <FaPlay />
                <span>{secondaryCTA}</span> {/* ✅ Dynamic secondary CTA */}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">{stat1Number}</div> {/* ✅ Dynamic stat */}
                <div className="text-orange-200">{stat1Label}</div> {/* ✅ Dynamic label */}
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">{stat2Number}</div> {/* ✅ Dynamic stat */}
                <div className="text-orange-200">{stat2Label}</div> {/* ✅ Dynamic label */}
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">{stat3Number}</div> {/* ✅ Dynamic stat */}
                <div className="text-orange-200">{stat3Label}</div> {/* ✅ Dynamic label */}
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <img
                src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"}
                alt={heroImage?.altText || "Colorful Diwali crackers and fireworks display"}
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-red-700 px-4 py-2 rounded-full font-bold text-sm animate-bounce">
                {specialOffer} {/* ✅ Dynamic special offer */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
