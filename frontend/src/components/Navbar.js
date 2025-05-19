// frontend/src/components/Navbar.js
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div>
        <button onClick={() => router.push('/register')} className="mr-4">
          Register
        </button>
        <button onClick={() => router.push('/login')} className="mr-4">
          Login
        </button>
        {isAuthenticated && (
          <button onClick={() => router.push('/dashboard')}>
            Dashboard
          </button>
        )}
      </div>
      {isAuthenticated && (
        <button onClick={handleLogout} className="text-red-400">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;