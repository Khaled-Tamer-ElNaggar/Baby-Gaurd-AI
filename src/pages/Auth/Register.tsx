import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, AlertTriangle, Scale, Ruler, Heart } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'pregnant' | 'newborn' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    expectedDueDate: '',
    childBirthDate: '',
    hasHealthConditions: false,
    healthConditions: '',
    // New fields for child information
    childName: '',
    childWeight: '',
    childHeight: '',
    childGender: '',
    bloodType: '',
    allergies: '',
    pediatrician: '',
    emergencyContact: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < (userType === 'newborn' ? 4 : 3)) {
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
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                           ${s <= step ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-400'}
                           ${s > (userType === 'newborn' ? 4 : 3) ? 'hidden' : ''}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                             dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                             dark:bg-gray-700 dark:text-white"
                    required
                  />
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
                    <Baby className="w-8 h-8 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                      Expecting
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('newborn')}
                    className={`p-4 rounded-xl border-2 transition-all
                              ${userType === 'newborn'
                                ? 'border-violet-600 bg-violet-50 dark:bg-violet-900'
                                : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <Baby className="w-8 h-8 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
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
                {userType === 'newborn' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Child's Birth Date
                    </label>
                    <input
                      type="date"
                      name="childBirthDate"
                      value={formData.childBirthDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                               dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && userType === 'newborn' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-violet-900 dark:text-violet-200 mb-6">
                  Child Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                               dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          name="childWeight"
                          value={formData.childWeight}
                          onChange={handleInputChange}
                          className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                                   dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Height (cm)
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="childHeight"
                          value={formData.childHeight}
                          onChange={handleInputChange}
                          className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                                   dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      name="childGender"
                      value={formData.childGender}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                               dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blood Type
                    </label>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl
                                 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {((step === 3 && userType === 'pregnant') || (step === 4 && userType === 'newborn')) && (
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
                {step === (userType === 'newborn' ? 4 : 3) ? 'Complete Registration' : 'Continue'}
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