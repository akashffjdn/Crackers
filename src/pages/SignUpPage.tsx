import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaStar, FaTrophy, FaGift } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { validatePassword } from '../utils/validation';
import logoImage from '../assets/logo_crackers.png';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | string[]>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error && (e.target.name === 'password' || e.target.name === 'confirmPassword' || e.target.name === 'email')) {
      setError('');
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
    if (e.target.checked && error === 'You must agree to the Terms and Conditions.') setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors);
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }
    setIsLoading(true);
    const result = await signup({
      firstName: formData.firstName, lastName: formData.lastName,
      email: formData.email, phone: formData.phone, password: formData.password,
    });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to create account.');
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-surface-900 flex overflow-hidden">
      {/* Left Side - Visual/Info */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 p-8 items-center justify-center relative overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1592843997881-cab3860b1067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlyZSUyMGNyYWNrZXJzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
            alt="Premium festival crackers display"
            className="w-full h-full object-cover"
          />
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40" />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/40 via-black/60 to-accent/40" />
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
              Join thousands of happy customers
            </h2>
            <p className="text-lg text-surface-300 mb-8">
              Create an account and unlock exclusive benefits, discounts, and offers for your festive celebrations.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: FaStar, title: 'Exclusive Offers', desc: 'Get access to member-only deals and early bird sales on premium crackers' },
                { icon: FaTrophy, title: 'Loyalty Rewards', desc: 'Earn reward points on every purchase and redeem them for exciting discounts' },
                { icon: FaGift, title: 'Special Discounts', desc: 'Enjoy up to 20% off on bulk orders and combo packs for festivals' }
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-gold text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">{benefit.title}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full relative z-10 my-auto"
        >
          {/* Logo/Brand */}
          <Link to="/" className="inline-block mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <img src={logoImage} alt="Akash Crackers" className="h-10 w-auto" />
              <span className="text-xl font-bold text-white">Akash Crackers</span>
            </motion.div>
          </Link>

          {/* Header */}
          <div className="mb-5">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Create account
            </h1>
            <p className="text-base text-surface-400">
              Start your festive shopping journey today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
            >
              {Array.isArray(error) ? (
                <ul className="list-disc list-inside space-y-0.5">
                  {error.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              ) : error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1.5">
                  First name
                </label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1.5">
                  Last name
                </label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1.5">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1.5">
                Phone number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-surface-500 mt-1">Min. 8 chars, uppercase, lowercase, number</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleTermsChange}
                required
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-0 mt-0.5"
              />
              <span className="text-xs text-surface-400 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-accent/90 text-white font-semibold text-sm hover:shadow-[0_0_40px_rgba(230,57,70,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-surface-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-surface-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
