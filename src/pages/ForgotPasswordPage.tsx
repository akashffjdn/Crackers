import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaRocket, FaShieldAlt, FaBolt } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import logoImage from '../assets/logo_crackers.png';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'If an account exists, a reset link has been sent.');
      setEmail('');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-surface-900 flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
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

          {!message ? (
            <>
              {/* Header */}
              <div className="mb-5">
                <div className="w-14 h-14 mb-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <FaEnvelope className="text-2xl text-accent" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  Forgot password?
                </h1>
                <p className="text-base text-surface-400">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-surface-300 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-accent/90 text-white font-semibold text-sm hover:shadow-[0_0_40px_rgba(230,57,70,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>

              {/* Back to Sign In */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
                >
                  <FaArrowLeft size={12} />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-14 h-14 mb-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Check your email</h3>
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-4">
                {message}
              </div>
              <p className="text-surface-400 text-sm mb-6">
                We've sent password reset instructions to your email.
              </p>
              <p className="text-xs text-surface-500 mb-4">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={handleSubmit}
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  try again
                </button>
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
              >
                <FaArrowLeft size={12} />
                <span>Back to sign in</span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Visual/Info */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
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
          <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-black/60 to-gold/40" />
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
              Light up your celebrations
            </h2>
            <p className="text-lg text-surface-300 mb-8">
              Premium quality crackers delivered right to your doorstep. Shop with confidence and make every moment special.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: FaRocket, title: 'Fast Delivery', desc: 'Get your orders delivered on time, every time with reliable shipping service' },
                { icon: FaShieldAlt, title: 'Safe & Secure', desc: 'Premium quality products with proper safety certifications and standards' },
                { icon: FaBolt, title: 'Best Prices', desc: 'Competitive pricing with amazing bulk discounts and seasonal offers' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="text-accent text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">{feature.title}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
