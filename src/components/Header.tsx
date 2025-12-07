import React, { useState } from 'react';
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
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { getContentValue } = useContent(); // ✅ Add this hook
  const navigate = useNavigate();
// ✅ Get dynamic content with fallbacks - CORRECTED field IDs
const companyName = getContentValue('companyName') || 'Akash Crackers';
const companyTagline = getContentValue('companyTagline') || 'Premium Sivakasi Fireworks';
const supportPhone = getContentValue('supportPhone') || '+918870296456';
const topBarMessage = getContentValue('headerAnnouncement') || '🎆 Festival Special Offers! Free Delivery on Orders Above ₹2000 🎆';


  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/festival-collections', label: 'Collections' },
    { href: '/contact', label: 'Contact' },
    { href:  '/quick-order', label:'Quick Order'}
  ];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-red-700 text-center py-2 text-sm">
        <p>{topBarMessage}</p> {/* ✅ Dynamic announcement message */}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-yellow-400 text-red-600 p-2 rounded-full font-bold text-xl">
              🎇
            </div>
            <div>
              <h1 className="text-2xl font-bold">{companyName}</h1> {/* ✅ Dynamic company name */}
              <p className="text-xs text-orange-200">{companyTagline}</p> {/* ✅ Dynamic tagline */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="hover:text-yellow-300 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4">
              {/* Call Now Button */}
              <a 
                href={`tel:${supportPhone}`} /* ✅ Dynamic phone number */
                className="flex items-center space-x-1 bg-yellow-500 text-red-700 px-3 py-2 rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors"
              >
                <FaPhone />
                <span>Call Now</span>
              </a>

              {/* Shopping Cart */}
              <Link to="/cart" className="relative hover:text-yellow-300 transition-colors">
                <FaShoppingCart className="text-xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Authentication Section */}
              {isAuthenticated && user ? (
                /* User Profile Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
                  >
                    <div className="bg-yellow-400 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">
                      {user.firstName}
                    </span>
                    <FaChevronDown className={`text-xs transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <FaUser className="text-blue-500" />
                          <span>My Account</span>
                        </Link>
                        
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <FaShoppingBag className="text-green-500" />
                          <span>My Orders</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <FaCog className="text-purple-500" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                        >
                          <FaSignOutAlt />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Signup Buttons */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors font-medium"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  
                  <Link
                    to="/signup"
                    className="flex items-center space-x-1 bg-white text-red-600 px-3 py-2 rounded-full font-semibold hover:bg-yellow-100 transition-colors"
                  >
                    <FaUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-red-500 pt-4 animate-fade-in-down">
            <div className="flex flex-col space-y-3">
              {/* Navigation Links */}
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="hover:text-yellow-300 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3 pt-3 border-t border-red-500">
                {/* Call Button */}
                <a 
                  href={`tel:${supportPhone}`} /* ✅ Dynamic phone number */
                  className="flex items-center space-x-2 bg-yellow-500 text-red-700 px-4 py-3 rounded-full font-semibold w-fit hover:bg-yellow-400 transition-colors"
                >
                  <FaPhone />
                  <span>Call Now</span>
                </a>
                
                {/* Cart */}
                <Link 
                  to="/cart" 
                  className="flex items-center space-x-2 text-yellow-300 hover:text-yellow-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart />
                  <span>Cart ({itemCount})</span>
                </Link>

                {/* Authentication Section */}
                {isAuthenticated && user ? (
                  /* Mobile User Menu */
                  <div className="space-y-3 pt-3 border-t border-red-500">
                    <div className="flex items-center space-x-3 text-yellow-300">
                      <div className="bg-yellow-400 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-orange-200">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors py-2"
                    >
                      <FaUser />
                      <span>My Account</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors py-2"
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
                      className="flex items-center space-x-2 text-red-200 hover:text-white transition-colors py-2"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  /* Mobile Login/Signup */
                  <div className="flex flex-col space-y-3 pt-3 border-t border-red-500">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors py-2"
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </Link>
                    
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 bg-white text-red-600 px-4 py-3 rounded-full font-semibold w-fit hover:bg-yellow-100 transition-colors"
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
