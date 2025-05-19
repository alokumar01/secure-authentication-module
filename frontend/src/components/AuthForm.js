// frontend/src/components/AuthForm.js
'use client';
import { useState } from 'react';
import axios from 'axios';
import {QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

const AuthForm = ({ isRegister = false }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [totp, setTotp] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('initial');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `http://localhost:5000/api/auth/${isRegister ? 'register' : 'login'}`;
    const data = isRegister ? { username, email, password } : { username, password };

    try {
      const res = await axios.post(url, data);
      setMessage(res.data.message);

      if (isRegister) {
        console.log('Username:', username);
        console.log('MFA Secret from Backend:', res.data.mfaSecret);
        setMfaSecret(res.data.mfaSecret);
        setStep('done');
      } else {
        setStep('email-otp');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-email-otp', { username, otp });
      localStorage.setItem('token', res.data.accessToken);
      setMessage(res.data.message);
      setStep('mfa');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMfa = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-mfa', { username, token: totp });
      localStorage.setItem('token', res.data.accessToken);
      setMessage(res.data.message);
      router.push('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl w-full mx-auto px-8">
      {step === 'initial' && (
        <>
          <h1 className="text-2xl mb-4">{isRegister ? 'Register' : 'Login'}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded text-white"
                disabled={loading}
              />
            </div>
            {isRegister && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded font-white"
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
            </button>
          </form>
        </>
      )}

      {step === 'email-otp' && (
        <>
          <h1 className="text-2xl mb-4">Enter Email OTP</h1>
          <form onSubmit={handleEmailOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Email OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Email OTP"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email OTP'}
            </button>
          </form>
        </>
      )}

      {step === 'mfa' && (
        <>
          <h1 className="text-2xl mb-4">Enter MFA Code</h1>
          <form onSubmit={handleMfa} className="space-y-4">
            <div>
              <label htmlFor="totp" className="block text-sm font-medium text-gray-700 mb-1">
                Google Authenticator Code
              </label>
              <input
                id="totp"
                type="text"
                placeholder="Google Authenticator Code"
                value={totp}
                required
                onChange={(e) => setTotp(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify MFA'}
            </button>
          </form>
        </>
      )}

      {step === 'done' && mfaSecret && (
        <div className="mt-4 text-center">
          <p className="mb-2">MFA Secret: {mfaSecret}</p>
          {(() => {
            const qrValue = `otpauth://totp/SecureAuth:${username}?secret=${mfaSecret}&issuer=SecureAuth`;
            console.log('QR Code Value:', qrValue);
            return (
              <QRCodeSVG // Switched to SVG
                value={qrValue}
                size={256}
                level="H"
              />
            );
          })()}
          <button
            onClick={() => router.push('/login')}
            className="mt-4 w-full p-2 bg-green-500 text-white rounded"
          >
            Proceed to Login
          </button>
        </div>
      )}

      {message && (
        <p className={`mt-2 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AuthForm;