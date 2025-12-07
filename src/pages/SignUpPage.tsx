// src/pages/SignUpPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
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
    // --- THIS IS THE CRITICAL LINE ---
    e.preventDefault(); // Prevent default form submission and page reload
    // ---------------------------------

    setError(''); // Clear previous errors

    // --- Frontend Validation ---
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const passwordValidation = validatePassword(formData.password); //
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors);
      return;
    }
     if (!agreedToTerms) {
       setError('You must agree to the Terms and Conditions.');
       return;
     }
    // --- End Frontend Validation ---


    setIsLoading(true);

    const result = await signup({ //
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    }); //

    if (result.success) {
      navigate('/');
    } else {
      // Set the error state with the message from the backend
      setError(result.error || 'Failed to create account. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join Akash Crackers family today</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Error Display Area */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                {Array.isArray(error) ? (
                  <ul className="list-disc list-inside text-sm">
                    {error.map((err, index) => <li key={index}>{err}</li>)}
                  </ul>
                ) : (
                  error // This is where the message should appear
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Form Inputs (Keep as before) --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required autoComplete="given-name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required autoComplete="family-name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required autoComplete="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required autoComplete="new-password" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" aria-describedby="password-constraints"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p id="password-constraints" className="text-xs text-gray-500 mt-1">Min. 8 characters, incl. uppercase, lowercase, number.</p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex items-start">
                <input id="terms" type="checkbox" checked={agreedToTerms} onChange={handleTermsChange} required className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"/>
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-500 underline">
                    Terms and Conditions
                  </Link> *
                </label>
              </div>
              {/* --- End Form Inputs --- */}

              <button
                type="submit" // This button triggers the form's onSubmit
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-md font-semibold hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <LoadingSpinner size="sm" color="text-white"/> : 'Create Account'}
              </button>
            </form>

            {/* --- Social Login & Link to Login (Keep as before) --- */}
            <div className="mt-6">
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>
              <div className="mt-6 grid grid-cols-2 gap-3"><button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><FaGoogle className="text-red-500 mr-2" /> Google</button><button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><FaFacebook className="text-blue-500 mr-2" /> Facebook</button></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-red-600 hover:text-red-500">Sign in</Link>
              </p>
            </div>
            {/* --- End Social Login & Link to Login --- */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;