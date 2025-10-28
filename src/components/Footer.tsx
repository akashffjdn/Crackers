import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const Footer: React.FC = () => {
  const { getContentValue } = useContent(); // ✅ Add this hook

// ✅ Get dynamic content with fallbacks - CORRECTED field IDs
const companyName = getContentValue('companyName') || 'Sparkle Crackers';
const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
const companyDescription = getContentValue('footerCompanyDescription') || 'Your trusted partner for safe, colorful, and memorable festival celebrations with premium quality crackers from Sivakasi.';
const companyPhone = getContentValue('companyPhone') || '+91 98765 43210';
const companyEmail = getContentValue('companyEmail') || 'info@sparklecrackers.com';
const companyAddress = getContentValue('companyAddress') || '123 Fireworks Street, Sivakasi, Tamil Nadu 626123';
const newsletterTitle = getContentValue('footerNewsletterTitle') || 'Stay Updated';
const newsletterDescription = getContentValue('footerNewsletterDescription') || 'Subscribe to get special offers and festival updates!';
const copyrightText = getContentValue('footerCopyright') || '© 2025 Akash Crackers. All rights reserved. | Licensed by Govt. of Tamil Nadu';


  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-400 text-red-600 p-2 rounded-full font-bold text-xl">
                🎇
              </div>
              <div>
                <h3 className="text-xl font-bold">{companyName}</h3> {/* ✅ Dynamic company name */}
                <p className="text-gray-400 text-sm">{companyTagline}</p> {/* ✅ Dynamic tagline */}
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {companyDescription} {/* ✅ Dynamic company description */}
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="text-blue-500 hover:text-blue-400 cursor-pointer text-xl" />
              <FaInstagram className="text-pink-500 hover:text-pink-400 cursor-pointer text-xl" />
              <FaWhatsapp className="text-green-500 hover:text-green-400 cursor-pointer text-xl" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Products</Link></li>
              <li><a href="contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/bulk-orders" className="hover:text-white transition-colors">Bulk Orders</a></li>
              <li><a href="/safety-guidelines" className="hover:text-white transition-colors">Safety Guidelines</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-red-500" />
                <span>{companyPhone}</span> {/* ✅ Dynamic phone number */}
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-red-500" />
                <span>{companyEmail}</span> {/* ✅ Dynamic email */}
              </div>
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-red-500 mt-1" />
                <span>{companyAddress}</span> {/* ✅ Dynamic address */}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{newsletterTitle}</h4> {/* ✅ Dynamic newsletter title */}
            <p className="text-gray-400 mb-4">
              {newsletterDescription} {/* ✅ Dynamic newsletter description */}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-red-500"
              />
              <button className="bg-red-600 px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{copyrightText}</p> {/* ✅ Dynamic copyright text */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
