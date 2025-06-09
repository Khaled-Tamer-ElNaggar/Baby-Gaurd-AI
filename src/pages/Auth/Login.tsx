import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Mail, Lock } from 'lucide-react';
import { auth, LoginData } from '../../lib/api.ts'; // Import auth from api.txt

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Prepare data for API
      const loginData: LoginData = {
        user_email: formData.email.toLowerCase(),
        user_pass: formData.password,
      };
      const response = await auth.login(loginData);
      if (response.token) {

        window.location.href = '/home';  // Navigate to home on successful login  

          // After successful login
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify({ 
          id: response.user.id,
          username: response.user.name,
          email: response.user.email,
          dateOfBirth: response.user.birthday,
          bloodType: response.user.blood_type,
          joinDate: response.user.join_date,
          darkMode: response.user.dark_mode,
          fontSize: response.user.font_size
          }));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-violet-900 dark:text-violet-200 mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl
                           dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl
                           dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700
                       dark:bg-violet-500 dark:hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-violet-600 dark:text-violet-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;