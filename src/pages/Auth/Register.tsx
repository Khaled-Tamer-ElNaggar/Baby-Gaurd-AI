import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertTriangle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'pregnant' | 'parent' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    expectedDueDate: '',
    hasHealthConditions: false,
    healthConditions: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle registration
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                           ${s <= step ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-400'}
                           dark:bg-violet-700 dark:text-violet-200`}
              >
                {s}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-violet-900 dark:text-violet-200 mb-6">
                  Create Your Account
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                             dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                             dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                             dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                             dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-violet-900 dark:text-violet-200 mb-6">
                  Tell Us About You
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('pregnant')}
                    className={`p-4 rounded-xl border-2 transition-all
                              ${userType === 'pregnant'
                                ? 'border-violet-600 bg-violet-50 dark:bg-violet-900'
                                : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                      Expecting
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('parent')}
                    className={`p-4 rounded-xl border-2 transition-all
                              ${userType === 'parent'
                                ? 'border-violet-600 bg-violet-50 dark:bg-violet-900'
                                : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                      New Parent
                    </span>
                  </button>
                </div>
                {userType === 'pregnant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expected Due Date
                    </label>
                    <input
                      type="date"
                      name="expectedDueDate"
                      value={formData.expectedDueDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                               dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-violet-900 dark:text-violet-200 mb-6">
                  Health Information
                </h2>
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please consult with your healthcare provider if you have any serious health conditions.
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hasHealthConditions"
                      checked={formData.hasHealthConditions}
                      onChange={handleInputChange}
                      className="rounded text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I have health conditions to report
                    </span>
                  </label>
                </div>
                {formData.hasHealthConditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Please describe any health conditions
                    </label>
                    <textarea
                      name="healthConditions"
                      value={formData.healthConditions}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                               dark:bg-gray-700 dark:text-white"
                      rows={4}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50
                           dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700
                         dark:bg-violet-500 dark:hover:bg-violet-600 ml-auto"
              >
                {step === 3 ? 'Complete Registration' : 'Continue'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-violet-600 dark:text-violet-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;