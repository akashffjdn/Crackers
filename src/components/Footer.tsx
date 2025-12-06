import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaShieldAlt, FaTruck, FaAward } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { getContentValue } = useContent();

  const companyName = getContentValue('companyName') || 'Sparkle Crackers';
  const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
  const companyDescription = getContentValue('footerCompanyDescription') || 'Your trusted partner for safe, colorful, and memorable festival celebrations with premium quality crackers from Sivakasi.';
  const companyPhone = getContentValue('companyPhone') || '+91 98765 43210';
  const companyEmail = getContentValue('companyEmail') || 'info@sparklecrackers.com';
  const companyAddress = getContentValue('companyAddress') || '123 Fireworks Street, Sivakasi, Tamil Nadu 626123';
  const newsletterTitle = getContentValue('footerNewsletterTitle') || 'Stay Updated';
  const newsletterDescription = getContentValue('footerNewsletterDescription') || 'Subscribe to get special offers and festival updates!';
  const copyrightText = getContentValue('footerCopyright') || '© 2025 Akash Crackers. All rights reserved. | Licensed by Govt. of Tamil Nadu';

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-6xl">🎆</div>
        <div className="absolute top-40 right-32 text-5xl">🎇</div>
        <div className="absolute bottom-32 left-40 text-6xl">✨</div>
        <div className="absolute bottom-20 right-20 text-4xl">🎊</div>
      </div>

      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg className="w-full h-20" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-400 text-red-700 p-3 rounded-full font-bold text-xl shadow-lg">
                  🎇
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display">{companyName}</h3>
                <p className="text-gray-400 text-sm">{companyTagline}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {companyDescription}
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-col space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <FaShieldAlt className="text-green-400" />
                <span>100% Safe & Legal</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <FaAward className="text-yellow-400" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <FaTruck className="text-blue-400" />
                <span>Fast Delivery</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold font-display mb-6 text-yellow-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2 group"
                >
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2 group"
                >
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Products</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2 group"
                >
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/bulk-orders" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2 group"
                >
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Bulk Orders</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/safety-guidelines" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2 group"
                >
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Safety Guidelines</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/festival-collections" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2 group"
                >
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Festival Collections</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold font-display mb-6 text-yellow-400">Contact Us</h4>
            <div className="space-y-4 text-gray-300">
              <a 
                href={`tel:${companyPhone}`}
                className="flex items-start space-x-3 hover:text-yellow-400 transition-colors group"
              >
                <FaPhone className="text-red-400 mt-1 group-hover:scale-110 transition-transform" />
                <span className="hover:underline">{companyPhone}</span>
              </a>
              <a 
                href={`mailto:${companyEmail}`}
                className="flex items-start space-x-3 hover:text-yellow-400 transition-colors group"
              >
                <FaEnvelope className="text-red-400 mt-1 group-hover:scale-110 transition-transform" />
                <span className="hover:underline break-all">{companyEmail}</span>
              </a>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                <span>{companyAddress}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold font-display mb-6 text-yellow-400">{newsletterTitle}</h4>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {newsletterDescription}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {copyrightText}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;