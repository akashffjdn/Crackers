import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaPhone, 
  FaShoppingCart, 
  FaUser, 
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaCog,
  FaShoppingBag,
  FaChevronDown,
  FaHeart
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { getContentValue } = useContent();
  const navigate = useNavigate();

  const companyName = getContentValue('companyName') || 'Akash Crackers';
  const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
  const supportPhone = getContentValue('supportPhone') || '+918870296456';
  const topBarMessage = getContentValue('headerAnnouncement') || '🎆 Festival Special Offers! Free Delivery on Orders Above ₹2000 🎆';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/festival-collections', label: 'Collections' },
    { href: '/contact', label: 'Contact' },
    { href: '/quick-order', label: 'Quick Order' }
  ];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50' 
          : 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600'
      }`}>
        {/* Top bar */}
        <div className="bg-gradient-to-r from-red-700 to-orange-700 text-center py-2 text-sm font-medium animate-pulse-slow">
          <p className="text-white">{topBarMessage}</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-400 text-red-700 p-3 rounded-full font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  🎇
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold font-display transition-colors ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  {companyName}
                </h1>
                <p className={`text-xs transition-colors ${
                  scrolled ? 'text-gray-600' : 'text-orange-100'
                }`}>
                  {companyTagline}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group ${
                    scrolled 
                      ? 'text-gray-700 hover:text-red-600 hover:bg-red-50' 
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
              
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
                {/* Call Now Button */}
                <a 
                  href={`tel:${supportPhone}`}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    scrolled
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
                      : 'bg-yellow-400 text-red-700 hover:bg-yellow-300'
                  }`}
                >
                  <FaPhone />
                  <span className="hidden xl:inline">Call Now</span>
                </a>

                {/* Shopping Cart */}
                <Link 
                  to="/cart" 
                  className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    scrolled
                      ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FaShoppingCart className="text-xl" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold shadow-lg animate-bounce">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Authentication Section */}
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        scrolled
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                          : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                      }`}
                    >
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md ${
                        scrolled
                          ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
                          : 'bg-yellow-400 text-red-700'
                      }`}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <span className="font-medium text-sm hidden xl:block">
                        {user.firstName}
                      </span>
                      <FaChevronDown className={`text-xs transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-slide-down overflow-hidden">
                        <div className="px-4 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                          <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                          >
                            <FaUser className="text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-700 font-medium">My Account</span>
                          </Link>
                          
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                          >
                            <FaShoppingBag className="text-green-500 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-700 font-medium">My Orders</span>
                          </Link>

                          {user.role === 'admin' && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                            >
                              <FaCog className="text-purple-500 group-hover:scale-110 transition-transform" />
                              <span className="text-gray-700 font-medium">Admin Panel</span>
                            </Link>
                          )}
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left text-red-600 group"
                          >
                            <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        scrolled
                          ? 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                          : 'text-white hover:text-yellow-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="hidden xl:inline">Login</span>
                      <FaSignInAlt className="xl:hidden" />
                    </Link>
                    
                    <Link
                      to="/signup"
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        scrolled
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
                          : 'bg-white text-red-600 hover:bg-yellow-50'
                      } shadow-lg`}
                    >
                      <span className="hidden xl:inline">Sign Up</span>
                      <FaUserPlus className="xl:hidden" />
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className={`px-4 pb-6 border-t ${
            scrolled ? 'border-gray-200 bg-white' : 'border-white/20 bg-white/5 backdrop-blur-md'
          }`}>
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    scrolled
                      ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                <a 
                  href={`tel:${supportPhone}`}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPhone />
                  <span>Call Now</span>
                </a>
                
                <Link 
                  to="/cart" 
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    scrolled
                      ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart />
                  <span>Cart ({itemCount})</span>
                </Link>

                {isAuthenticated && user ? (
                  <div className="space-y-2 pt-2 border-t border-white/20">
                    <div className={`px-4 py-3 rounded-xl ${
                      scrolled ? 'bg-gray-50' : 'bg-white/10'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold ${
                          scrolled
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
                            : 'bg-yellow-400 text-red-700'
                        }`}>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-semibold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-orange-200'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        scrolled
                          ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <FaUser />
                      <span>My Account</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          scrolled
                            ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <FaCog />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all w-full text-left ${
                        scrolled
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-red-200 hover:bg-white/10'
                      }`}
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-white/20">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        scrolled
                          ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </Link>
                    
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg"
                    >
                      <FaUserPlus />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
      
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;