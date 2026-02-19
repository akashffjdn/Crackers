import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';
import logoImage from '../assets/logo_crackers.png';

const Footer: React.FC = () => {
  const { getContentValue } = useContent();

  const companyName = getContentValue('companyName') || 'Crackers';
  const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
  const companyDescription = getContentValue('footerCompanyDescription') || 'Your trusted partner for safe, colorful, and memorable festival celebrations with premium quality crackers from Sivakasi.';
  const companyPhone = getContentValue('companyPhone') || '+91 98765 43210';
  const companyEmail = getContentValue('companyEmail') || 'info@sparklecrackers.com';
  const companyAddress = getContentValue('companyAddress') || '123 Fireworks Street, Sivakasi, Tamil Nadu 626123';
  const copyrightText = getContentValue('footerCopyright') || '© 2026 Crackers. All rights reserved.';

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop All' },
    { to: '/festival-collections', label: 'Collections' },
    { to: '/quick-order', label: 'Quick Order' },
    { to: '/bulk-orders', label: 'Bulk Orders' },
  ];

  const supportLinks = [
    { to: '/contact', label: 'Contact Us' },
    { to: '/safety-guidelines', label: 'Safety Guidelines' },
    { to: '/bulk-orders', label: 'Wholesale Inquiry' },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-surface-900 relative">
      {/* Top divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white font-bold text-xl mb-4">
              <img src={logoImage} alt="Akash Crackers" className="h-10 w-auto" />
              {companyName}
            </Link>
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-3">{companyTagline}</p>
            <p className="text-sm text-surface-400 mb-6 max-w-xs leading-relaxed">{companyDescription}</p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-surface-400 uppercase tracking-[0.2em] mb-5">Shop</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-500 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-surface-400 uppercase tracking-[0.2em] mb-5">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-surface-500 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-surface-400 uppercase tracking-[0.2em] mb-5">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaPhone className="text-accent mt-0.5 flex-shrink-0" size={11} />
                <span className="text-sm text-surface-400">{companyPhone}</span>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-accent mt-0.5 flex-shrink-0" size={11} />
                <span className="text-sm text-surface-400">{companyEmail}</span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" size={11} />
                <span className="text-sm text-surface-400 leading-relaxed">{companyAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-white/[0.04]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-surface-600">{copyrightText}</p>
        <div className="flex items-center gap-4">
          <p className="text-xs text-surface-600">Licensed by Govt. of Tamil Nadu</p>
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-surface-500 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
          >
            <FaArrowUp size={10} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
