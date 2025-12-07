import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaTruck, FaPhone, FaCertificate, FaCheckCircle } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Features: React.FC = () => {
  const { getContentValue, getFeatures } = useContent();
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  const sectionTitle = getContentValue('featuresSection') || 'Why Choose Us?';
  const sectionSubtitle = getContentValue('featuresSubtitle') || 'We\'re committed to making your festivals brighter and safer with our premium quality products and exceptional service.';
  const dynamicFeatures = getFeatures();

  const iconMap: { [key: string]: React.ReactElement } = {
    'FaShieldAlt': <FaShieldAlt className="text-4xl" />,
    'FaTruck': <FaTruck className="text-4xl" />,
    'FaPhone': <FaPhone className="text-4xl" />,
    'FaCertificate': <FaCertificate className="text-4xl" />
  };

  const features = dynamicFeatures.length > 0 ? dynamicFeatures.map(feature => ({
    icon: iconMap[feature.icon] || <FaShieldAlt className="text-4xl" />,
    title: feature.title,
    description: feature.description
  })) : [
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "100% Safe & Legal",
      description: "All our products comply with government safety standards and regulations."
    },
    {
      icon: <FaTruck className="text-4xl" />,
      title: "Fast Delivery",
      description: "Quick and secure delivery across India with proper packaging."
    },
    {
      icon: <FaPhone className="text-4xl" />,
      title: "24/7 Support",
      description: "Our expert team is always ready to help you with your queries."
    },
    {
      icon: <FaCertificate className="text-4xl" />,
      title: "Premium Quality",
      description: "Authentic Sivakasi crackers with guaranteed quality and performance."
    }
  ];

  useEffect(() => {
    features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFeatures(prev => [...prev, index]);
      }, index * 150);
    });
  }, [features]);

  return (
    <section className="relative py-24 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-7xl animate-float">✨</div>
        <div className="absolute top-40 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>🎆</div>
        <div className="absolute bottom-32 left-20 text-6xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
        <div className="absolute bottom-20 right-32 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 via-orange-600/80 to-yellow-500/80"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-white/30">
            <FaCheckCircle className="mr-2 text-yellow-300" />
            <span>Trusted Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              {sectionTitle}
            </span>
          </h2>
          
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const isVisible = visibleFeatures.includes(index);
            
            return (
              <div
                key={index}
                className={`group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/0 via-orange-400/0 to-red-400/0 group-hover:from-yellow-400/30 group-hover:via-orange-400/30 group-hover:to-red-400/30 transition-all duration-500"></div>
                
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-white to-orange-50 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto shadow-xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <div className="text-red-600 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-center group-hover:text-yellow-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-orange-100 text-center leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-all duration-500"></div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl group-hover:bg-orange-400/20 transition-all duration-500"></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-16 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
