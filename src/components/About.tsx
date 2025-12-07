import React, { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { FaCheckCircle, FaAward, FaTrophy, FaRocket } from 'react-icons/fa';

const About: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const aboutTitle = getContentValue('aboutTitle') || 'Celebrating Festivals for Over 15 Years';
  const aboutContent = getContentValue('aboutContent') || 'Based in the heart of Sivakasi, the fireworks capital of India, we have been bringing joy and light to millions of families across the country. Our commitment to quality, safety, and customer satisfaction has made us a trusted name in the industry.';
  const aboutFeature1 = getContentValue('aboutFeature1') || 'ISO certified manufacturing facility';
  const aboutFeature2 = getContentValue('aboutFeature2') || 'Government licensed and approved products';
  const aboutFeature3 = getContentValue('aboutFeature3') || 'Eco-friendly and minimal smoke formulations';
  const aboutFeature4 = getContentValue('aboutFeature4') || 'Pan India delivery network';
  const aboutButtonText = getContentValue('aboutButtonText') || 'Learn More About Us';
  const aboutBadgeText = getContentValue('aboutBadgeText') || '🏆 Award Winning Quality';
  const aboutImage = getContentMetadata('aboutImage');

  const features = [
    { text: aboutFeature1, icon: <FaAward /> },
    { text: aboutFeature2, icon: <FaCheckCircle /> },
    { text: aboutFeature3, icon: <FaRocket /> },
    { text: aboutFeature4, icon: <FaTrophy /> }
  ];

  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 text-8xl animate-float">🎆</div>
        <div className="absolute bottom-20 left-10 text-7xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`${isVisible ? 'animate-slide-left' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 animate-scale-in">
              <FaTrophy className="mr-2 text-yellow-500" />
              <span>Trusted Since 2010</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {aboutTitle}
              </span>
            </h2>
            
            {/* Content */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {aboutContent}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:translate-x-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 font-medium text-lg pt-2 group-hover:text-red-600 transition-colors">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="group relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/50">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>{aboutButtonText}</span>
                <FaRocket className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>

          {/* Right Content - Image */}
          <div className={`relative ${isVisible ? 'animate-slide-right' : 'opacity-0'}`}>
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-orange-400/30 to-yellow-400/30 rounded-3xl blur-3xl animate-pulse-glow"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={aboutImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=500&fit=crop"}
                    alt={aboutImage?.altText || "Sivakasi crackers manufacturing"}
                    className="w-full h-96 object-cover rounded-2xl shadow-xl transform hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 via-transparent to-transparent"></div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-6 rounded-2xl font-bold text-lg shadow-2xl animate-bounce border-4 border-white transform hover:scale-110 transition-transform">
                  <div className="flex items-center space-x-3">
                    <FaTrophy className="text-2xl" />
                    <span>{aboutBadgeText}</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Floating Cards */}
                <div className="absolute top-1/4 -left-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-100 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                      <FaCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">ISO Certified</div>
                      <div className="text-xs text-gray-600">Quality Assured</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 -right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                      <FaAward className="text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">15+ Years</div>
                      <div className="text-xs text-gray-600">Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
