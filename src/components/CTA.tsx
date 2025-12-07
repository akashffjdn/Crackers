import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { FaArrowRight, FaShoppingCart, FaFileAlt, FaPhone, FaTruck, FaShieldAlt, FaSparkles } from 'react-icons/fa';

const CTA: React.FC = () => {
  const { getContentValue } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const ctaTitle = getContentValue('cta-title') || 'Ready to Light Up Your Festival?';
  const ctaSubtitle = getContentValue('cta-subtitle') || 'Don\'t wait! Order your premium crackers now and make this festival unforgettable.';
  const ctaOffer = getContentValue('cta-offer') || 'Free delivery on orders above ₹2000.';
  const primaryButton = getContentValue('cta-primary-button') || 'Order Now 🛒';
  const secondaryButton = getContentValue('cta-secondary-button') || 'Get Catalog 📋';
  const contactInfo = getContentValue('cta-contact-info') || '📞 Call us: +91 98765 43210 | 🚚 Free delivery | 💯 100% Safe';

  return (
    <section className="relative py-24 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-7xl animate-float">✨</div>
        <div className="absolute top-32 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>🎆</div>
        <div className="absolute bottom-20 left-32 text-6xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
        <div className="absolute bottom-32 right-10 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 via-orange-600/90 to-yellow-500/90"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
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

      <div className={`relative max-w-5xl mx-auto text-center px-6 z-10 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
        {/* Badge */}
        <div className="inline-flex items-center bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-white/30 animate-slide-up">
          <FaSparkles className="mr-2 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Limited Time Offer</span>
        </div>

        {/* Main Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-slide-up stagger-1">
          <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-gradient">
            {ctaTitle}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-2">
          {ctaSubtitle}
        </p>

        {/* Offer Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-red-700 px-6 py-3 rounded-full font-bold text-lg mb-10 shadow-2xl animate-bounce animate-slide-up stagger-3">
          <FaTruck className="mr-2" />
          <span>{ctaOffer}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-slide-up stagger-4">
          <Link 
            to="/shop" 
            className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-10 py-5 rounded-full text-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <FaShoppingCart />
              <span>{primaryButton}</span>
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
          
          <Link 
            to="/catalog" 
            className="group relative overflow-hidden border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm bg-white/10 shadow-xl"
          >
            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <FaFileAlt className="relative z-10" />
            <span className="relative z-10">{secondaryButton}</span>
          </Link>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up stagger-5">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaPhone className="text-white text-xl" />
              </div>
              <div className="text-left">
                <div className="text-xs text-orange-200">Call Us</div>
                <div className="text-sm font-semibold">24/7 Support</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaTruck className="text-white text-xl" />
              </div>
              <div className="text-left">
                <div className="text-xs text-orange-200">Free Delivery</div>
                <div className="text-sm font-semibold">Above ₹2000</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div className="text-left">
                <div className="text-xs text-orange-200">100% Safe</div>
                <div className="text-sm font-semibold">Certified Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Text */}
        <p className="text-sm md:text-base text-orange-100 animate-slide-up stagger-6">
          {contactInfo}
        </p>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default CTA;
