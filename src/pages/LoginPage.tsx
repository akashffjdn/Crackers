import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaRocket, FaShieldAlt, FaBolt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import logoImage from '../assets/logo_crackers.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setIsLoading(false);
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

          {/* Header */}
          <div className="mb-5">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-base text-surface-400">
              Sign in to continue your shopping experience
            </p>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
            >
              {error || authError}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
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
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-0"
                />
                <span className="text-xs text-surface-400 group-hover:text-surface-300 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-accent/90 text-white font-semibold text-sm hover:shadow-[0_0_40px_rgba(230,57,70,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-surface-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-surface-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
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

export default LoginPage;
