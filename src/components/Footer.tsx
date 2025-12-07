import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Footer: React.FC = () => {
  const { getContentValue } = useContent();
  const [email, setEmail] = useState('');

  const companyName = getContentValue('companyName') || 'Sparkle Crackers';
  const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
  const companyDescription = getContentValue('footerCompanyDescription') || 'Your trusted partner for safe, colorful, and memorable festival celebrations with premium quality crackers from Sivakasi.';
  const companyPhone = getContentValue('companyPhone') || '+91 98765 43210';
  const companyEmail = getContentValue('companyEmail') || 'info@sparklecrackers.com';
  const companyAddress = getContentValue('companyAddress') || '123 Fireworks Street, Sivakasi, Tamil Nadu 626123';
  const newsletterTitle = getContentValue('footerNewsletterTitle') || 'Stay Updated';
  const newsletterDescription = getContentValue('footerNewsletterDescription') || 'Subscribe to get special offers and festival updates!';
  const copyrightText = getContentValue('footerCopyright') || '© 2025 Akash Crackers. All rights reserved. | Licensed by Govt. of Tamil Nadu';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl animate-float">✨</div>
        <div className="absolute top-40 right-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>🎆</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
        <div className="absolute bottom-20 right-32 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Company Info */}
          <div className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 text-red-600 p-3 rounded-full font-bold text-2xl shadow-lg">
                  🎇
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {companyName}
                </h3>
                <p className="text-gray-400 text-sm">{companyTagline}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {companyDescription}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
              >
                <FaFacebook className="text-xl group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
              >
                <FaInstagram className="text-xl group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
              >
                <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="animate-slide-up stagger-1">
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Products' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/bulk-orders', label: 'Bulk Orders' },
                { to: '/safety-guidelines', label: 'Safety Guidelines' }
              ].map((link, index) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:font-semibold transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="animate-slide-up stagger-2">
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Contact Us
            </h4>
            <div className="space-y-4">
              <a 
                href={`tel:${companyPhone}`}
                className="group flex items-start space-x-3 text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2"
              >
                <div className="mt-1 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <FaPhone className="text-sm" />
                </div>
                <span className="group-hover:font-semibold transition-all">{companyPhone}</span>
              </a>
              <a 
                href={`mailto:${companyEmail}`}
                className="group flex items-start space-x-3 text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2"
              >
                <div className="mt-1 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <FaEnvelope className="text-sm" />
                </div>
                <span className="group-hover:font-semibold transition-all break-all">{companyEmail}</span>
              </a>
              <div className="group flex items-start space-x-3 text-gray-300">
                <div className="mt-1 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaMapMarkerAlt className="text-sm" />
                </div>
                <span>{companyAddress}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Newsletter */}
          <div className="animate-slide-up stagger-3">
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {newsletterTitle}
            </h4>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {newsletterDescription}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>
              <button 
                type="submit"
                className="group w-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Subscribe</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Copyright Section */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              {copyrightText}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
