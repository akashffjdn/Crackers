// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api'; // Import your api instance
import { useAuth } from '../context/AuthContext'; // To potentially log user in after reset
import { validatePassword } from '../utils/validation';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get token from URL
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success
  const [error, setError] = useState<string | string[]>(''); // For errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
        setError('Invalid or missing reset token.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors);
      return;
    }


    setIsLoading(true);

    try {
      // --- BACKEND CALL ---
      const response = await api.put(`/auth/reset-password/${token}`, { password });

      setMessage(response.data.message || 'Password reset successfully!');

      // Optional: Automatically log the user in
       if (response.data.token && response.data.user) {
           // Simulate login success in AuthContext using the returned data
           localStorage.setItem('crackers_user_token', response.data.token);
           localStorage.setItem('crackers_user_profile', JSON.stringify(response.data.user));
           // You might need to manually update AuthContext state here or reload
           // For simplicity, redirect to login confirmation or dashboard
            alert('Password reset! Redirecting to login...');
            navigate('/login'); // Redirect to login page
       } else {
            // If backend doesn't return login data, just show success and link to login
            setPassword(''); // Clear fields
            setConfirmPassword('');
       }

    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <FaKey className="text-4xl text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Display Success Message */}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                {message}
                <div className="mt-2">
                     <Link to="/login" className="font-medium text-green-800 hover:underline">
                         Proceed to Login
                     </Link>
                </div>
              </div>
            )}
            {/* Display Error Message */}
            {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                 {Array.isArray(error) ? (
                   <ul className="list-disc list-inside text-sm">
                     {error.map((err, index) => <li key={index}>{err}</li>)}
                   </ul>
                 ) : (
                   error
                 )}
               </div>
            )}

            {!message && ( // Only show form if no success message
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      aria-describedby="password-constraints-reset"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p id="password-constraints-reset" className="text-xs text-gray-500 mt-1">Min. 8 characters, incl. uppercase, lowercase, number.</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-md font-semibold hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <LoadingSpinner size="sm" color="text-white"/> : 'Reset Password'}
                </button>
              </form>
            )}

             {!message && ( // Show link only if form is visible
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Remembered it?{' '}
                    <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;