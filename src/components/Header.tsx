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
  FaChevronDown
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { getContentValue } = useContent();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const companyName = getContentValue('companyName') || 'Akash Crackers';
  const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
  const supportPhone = getContentValue('supportPhone') || '+918870296456';
  const topBarMessage = getContentValue('headerAnnouncement') || '🎆 Festival Special Offers! Free Delivery on Orders Above ₹2000 🎆';

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-red-100' 
        : 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600'
    }`}>
      {/* Animated Top Bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white text-center py-2.5 text-sm font-medium relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        <p className="relative z-10 animate-slide-up">{topBarMessage}</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo with Animation */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 text-red-600 p-3 rounded-full font-bold text-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                🎇
              </div>
            </div>
            <div className="animate-slide-left">
              <h1 className={`text-2xl font-extrabold transition-colors duration-300 ${
                isScrolled ? 'text-red-600' : 'text-white'
              }`}>
                {companyName}
              </h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-orange-200'
              }`}>
                {companyTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-semibold transition-all duration-300 group ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-red-600' 
                    : 'text-white hover:text-yellow-300'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-4">
              {/* Enhanced Call Now Button */}
              <a 
                href={`tel:${supportPhone}`}
                className="group relative flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-4 py-2.5 rounded-full text-sm font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <FaPhone className="relative z-10 animate-pulse" />
                <span className="relative z-10">Call Now</span>
              </a>

              {/* Enhanced Shopping Cart */}
              <Link 
                to="/cart" 
                className={`relative group transition-all duration-300 transform hover:scale-110 ${
                  isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-yellow-300'
                }`}
              >
                <div className="relative">
                  <FaShoppingCart className="text-2xl transition-transform duration-300 group-hover:rotate-12" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold animate-bounce shadow-lg border-2 border-white">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Enhanced Authentication Section */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 hover:from-red-100 hover:to-orange-100'
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-red-600 rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shadow-lg">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <span className="font-semibold text-sm hidden lg:block">
                      {user.firstName}
                    </span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-in overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50"></div>
                      <div className="relative px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                        <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-white/90">{user.email}</p>
                      </div>
                      
                      <div className="py-2 relative">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                        >
                          <FaUser className="text-blue-500 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-gray-700">My Account</span>
                        </Link>
                        
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                        >
                          <FaShoppingBag className="text-green-500 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-gray-700">My Orders</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                          >
                            <FaCog className="text-purple-500 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-gray-700">Admin Panel</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-all duration-200 w-full text-left text-red-600 font-medium group"
                        >
                          <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-red-600' 
                        : 'text-white hover:text-yellow-300'
                    }`}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 bg-gradient-to-r from-white to-orange-50 text-red-600 px-4 py-2.5 rounded-full font-bold hover:from-yellow-50 hover:to-orange-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Enhanced Mobile menu button */}
          <button
            className={`md:hidden text-3xl transition-all duration-300 transform hover:scale-110 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="animate-scale-in" />
            ) : (
              <FaBars className="animate-scale-in" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-red-200 pt-4 animate-slide-up bg-white/95 backdrop-blur-md rounded-2xl mt-2 shadow-xl">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-semibold text-gray-700 hover:text-red-600 transition-all duration-300 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                <a 
                  href={`tel:${supportPhone}`}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-6 py-3 rounded-full font-bold w-full hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <FaPhone className="animate-pulse" />
                  <span>Call Now</span>
                </a>
                
                <Link 
                  to="/cart" 
                  className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition-colors font-semibold py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart />
                  <span>Cart ({itemCount})</span>
                </Link>

                {isAuthenticated && user ? (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-gray-700 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors py-3 px-4 rounded-xl hover:bg-red-50"
                    >
                      <FaUser />
                      <span className="font-semibold">My Account</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors py-3 px-4 rounded-xl hover:bg-red-50"
                      >
                        <FaCog />
                        <span className="font-semibold">Admin Panel</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors py-3 px-4 rounded-xl hover:bg-red-50 w-full text-left font-semibold"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 text-gray-700 hover:text-red-600 transition-colors py-3 px-4 rounded-xl hover:bg-red-50 font-semibold"
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </Link>
                    
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold w-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                      <FaUserPlus />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
