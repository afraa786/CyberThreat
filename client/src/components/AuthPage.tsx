import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type UserData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

type LoginData = {
  email: string;
  password: string;
};

type VerifyData = {
  email: string;
  verificationCode: string;
};

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState<'signup' | 'login' | 'verify'>('signup');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [userData, setUserData] = useState<UserData>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        username: `${userData.name} ${userData.lastName}`,
        role: userData.role
      };

      await axios.post('http://localhost:2000/auth/signup', payload);
      setActiveForm('verify');
      setSuccess('Account created! Check your email for the OTP.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Signup failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:2000/auth/login', {
        email: loginData.email,
        password: loginData.password
      });

      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      navigate('/home');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post('http://localhost:2000/auth/verify', {
        email: userData.email,
        verificationCode: otp
      });

      setSuccess('Account verified successfully! You can now login.');
      setActiveForm('login');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'OTP verification failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await axios.post('http://localhost:2000/auth/resend', null, {
        params: { email: userData.email }
      });
      setSuccess('New OTP sent successfully!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to resend OTP');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-600 p-3 rounded mb-4 text-center"
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-600 p-3 rounded mb-4 text-center"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeForm === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
              <form onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">First Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleUserChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleUserChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleUserChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleUserChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 rounded font-medium transition ${isLoading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Sign Up'}
                </button>
                
                <p className="mt-4 text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveForm('login')}
                    className="text-blue-400 hover:underline"
                  >
                    Login
                  </button>
                </p>
              </form>
            </motion.div>
          )}

          {activeForm === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 rounded font-medium transition ${isLoading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                
                <p className="mt-4 text-center">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveForm('signup')}
                    className="text-blue-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </motion.div>
          )}

          {activeForm === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Verify Account</h2>
              <p className="mb-4 text-center">We've sent a 6-digit OTP to {userData.email}</p>
              
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label className="block mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-center text-xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 rounded font-medium transition mb-4 ${isLoading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoading ? 'Verifying...' : 'Verify Account'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className={`w-full py-2 rounded font-medium transition ${isLoading ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  {isLoading ? 'Sending...' : 'Resend OTP'}
                </button>
                
                <p className="mt-4 text-center">
                  Go back to{' '}
                  <button
                    type="button"
                    onClick={() => setActiveForm('login')}
                    className="text-blue-400 hover:underline"
                  >
                    Login
                  </button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;