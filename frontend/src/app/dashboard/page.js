'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Dashboard() {
  const [accessMessage, setAccessMessage] = useState('');
  const [countdown, setCountdown] = useState(5); // Start at 5 seconds
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const grantComputerAccess = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/grant-access',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAccessMessage(res.data.message);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        setAccessMessage(err.response?.data?.message || 'Failed to grant access');
      } finally {
        setLoading(false);
      }
    };

    grantComputerAccess();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
        {loading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-4 text-blue-400">Welcome to the Dashboard</h1>
            <p className="text-lg text-center mb-6 text-gray-300">{accessMessage}</p>
            {countdown > 0 && (
              <div className="text-center">
                <p className="text-xl font-semibold text-green-400 animate-pulse">
                  Unlocking system in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
