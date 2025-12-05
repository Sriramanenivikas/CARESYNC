import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { validateLoginForm } from '../utils/validation';
import { FiLock, FiEye, FiEyeOff, FiUser, FiArrowLeft } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { error: showError } = useNotification();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/app/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      showError(result.error);
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  const demoAccounts = [
    { role: 'Test (Read-Only)', user: 'test', pass: 'Test@123$' },
    { role: 'Doctor', user: 'dr.smith', pass: 'Doctor@123' },
    { role: 'Nurse', user: 'nurse.lisa', pass: 'Nurse@123' },
    { role: 'Receptionist', user: 'reception.mary', pass: 'Recept@123' },
    { role: 'Patient', user: 'patient.robert', pass: 'Patient@123' },
  ];

  return (
    <div className="min-h-screen flex dot-grid">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black p-12 flex-col justify-between relative">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to home
          </button>
          <div className="minecraft-heading text-2xl text-white">CareSync</div>
        </div>

        <div className="space-y-6">
          <span className="monospace-label bg-gray-800 text-white">{"// SIGN IN"}</span>
          <h1 className="text-4xl text-white leading-tight" style={{fontFamily: '"Times New Roman", Times, serif', fontWeight: 500}}>
            Hospital Management<br />
            <span className="highlight-green">System</span>
          </h1>
          <p className="text-gray-400 max-w-md text-base leading-relaxed">
            Streamline your healthcare operations with our comprehensive management platform. 
            Manage patients, appointments, prescriptions, and billing in one place.
          </p>
          
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="px-3 py-1.5 border border-gray-700 text-gray-300 text-xs">RBAC Secured</span>
            <span className="px-3 py-1.5 border border-gray-700 text-gray-300 text-xs">Real-time KPIs</span>
            <span className="px-3 py-1.5 border border-gray-700 text-gray-300 text-xs">₹ Currency</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-500 text-xs">
          <span>🔒 Secure & Compliant</span>
          <span>•</span>
          <span>⚡ Fast & Reliable</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-black">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <span className="minecraft-heading text-xl text-black dark:text-white">CareSync</span>
          </div>

          <div className="text-center mb-8">
            <span className="monospace-label mb-4">{"// ACCESS"}</span>
            <h2 className="text-2xl mt-2" style={{fontFamily: '"Times New Roman", Times, serif', fontWeight: 500}}>Sign in</h2>
            <p className="text-gray-500 mt-2 text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border text-sm text-gray-800 dark:text-gray-200
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent
                    transition-shadow ${errors.username ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  disabled={loading}
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-white dark:bg-black border text-sm text-gray-800 dark:text-gray-200
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent
                    transition-shadow ${errors.password ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 
                text-white dark:text-black text-sm font-semibold
                transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wide text-center mb-4">{"// Demo Credentials"}</p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <div 
                  key={acc.role}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setFormData({ username: acc.user, password: acc.pass })}
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{acc.role}</span>
                  <code className="text-xs text-gray-500">{acc.user}</code>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} CareSync. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
