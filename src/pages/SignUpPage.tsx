import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { validatePassword } from '../utils/validation';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | string[]>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error && (e.target.name === 'password' || e.target.name === 'confirmPassword' || e.target.name === 'email')) {
      setError('');
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
    if (e.target.checked && error === 'You must agree to the Terms and Conditions.') {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields.");
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
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse-slow">🎆</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}>🎇</div>
          <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-bounce-slow">✨</div>
        </div>

        <div className="max-w-2xl w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="inline-block relative mb-4">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-400 text-red-700 p-4 rounded-full text-5xl shadow-2xl">
                🎊
              </div>
            </div>
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600 text-lg">Join us and light up your celebrations!</p>
          </div>

          {/* Signup Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-slide-up">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-down" role="alert">
                {Array.isArray(error) ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {error.map((err, index) => <li key={index}>{err}</li>)}
                  </ul>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                      placeholder="••••••••"
                      aria-describedby="password-constraints"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p id="password-constraints" className="text-xs text-gray-500 mt-1">
                    Min. 8 characters, uppercase, lowercase, number
                  </p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={handleTermsChange}
                  required
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 font-semibold underline"
                  >
                    Terms and Conditions
                  </Link>{' '}
                  *
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <FaArrowRight className="text-sm" />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-105"
              >
                <FaGoogle className="text-red-500 mr-2 text-lg" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-105"
              >
                <FaFacebook className="text-blue-500 mr-2 text-lg" />
                <span>Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-red-600 hover:text-red-700 transition-colors inline-flex items-center space-x-1 group"
                >
                  <span>Sign in</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;