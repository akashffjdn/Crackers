import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaHeart,
  FaSearch
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import logoImage from '../assets/logo_crackers.png';

const Header: React.FC = () => {
  const { getContentValue } = useContent();
  const companyName = getContentValue('companyName') || 'Crackers';

  const { items: cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = () => setIsProfileOpen(false);
    if (isProfileOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/festival-collections', label: 'Collections' },
    { to: '/bulk-orders', label: 'Bulk Orders' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-surface-900/95 backdrop-blur-xl border-b border-white/[0.08] shadow-lg'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition-opacity"
            >
              <img src={logoImage} alt="Akash Crackers" className="h-10 w-auto" />
              <span className="hidden sm:block">{companyName}</span>
            </Link>

            {/* Desktop Nav - Centered */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.to)
                      ? 'text-white bg-white/10'
                      : 'text-surface-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-9 h-9 rounded-lg text-surface-300 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all"
                aria-label="Search"
              >
                <FaSearch size={14} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative w-9 h-9 rounded-lg text-surface-300 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all"
                aria-label="Cart"
              >
                <FaShoppingCart size={15} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-surface-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">
                        {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <FaChevronDown size={10} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-surface-800/95 backdrop-blur-xl border border-white/10 py-2 shadow-2xl"
                      >
                        <div className="px-3 py-2 border-b border-white/5">
                          <p className="text-xs font-semibold text-white">{user.firstName}</p>
                          <p className="text-xs text-surface-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
                          <FaUser size={12} /> Dashboard
                        </Link>
                        <Link to="/cart" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
                          <FaHeart size={12} /> Wishlist
                        </Link>
                        <div className="h-px bg-white/5 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent hover:bg-accent/10 transition-all"
                        >
                          <FaSignOutAlt size={12} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-semibold transition-all hover:shadow-lg"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile: Cart + Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/cart" className="relative w-9 h-9 rounded-lg text-surface-300 hover:text-white flex items-center justify-center transition-colors">
                <FaShoppingCart size={16} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="w-9 h-9 rounded-lg text-surface-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Menu"
              >
                {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block border-t border-white/5 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="relative max-w-2xl mx-auto">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface-800/50 border border-white/10 text-white text-sm placeholder-surface-400 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 w-72 max-w-[85vw] h-full z-50 bg-surface-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
            >
              <div className="flex flex-col h-full p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <span className="text-white font-bold text-lg">Menu</span>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="w-8 h-8 rounded-lg text-surface-300 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-800/50 border border-white/10 text-white text-sm placeholder-surface-400 focus:border-accent/50 focus:outline-none transition-all"
                  />
                </div>

                {/* Nav Links */}
                <div className="space-y-1 mb-6 flex-1 overflow-y-auto">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setIsMobileOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.to)
                            ? 'text-white bg-white/10'
                            : 'text-surface-300 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* User Section */}
                <div className="pt-4 border-t border-white/10">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-3 py-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center">
                          <span className="text-sm font-bold text-accent">{user.firstName?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{user.firstName}</p>
                          <p className="text-xs text-surface-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <FaUser size={12} /> Dashboard
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-accent hover:bg-accent/10 transition-all"
                      >
                        <FaSignOutAlt size={12} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full py-3 rounded-lg bg-accent hover:bg-accent/90 text-white text-center text-sm font-semibold transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 text-white text-center text-sm font-semibold transition-all"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
