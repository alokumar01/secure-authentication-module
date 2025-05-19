// frontend/src/app/page.js
'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Secure Authentication Module</h1>
        <p className="mb-4">Welcome! Please choose an option:</p>
        <div className="space-y-4">

          <button
            onClick={() => router.push('/register')}
            className="w-full p-2 bg-blue-500 text-white rounded hover:cursor-pointer"
          >
            Register
          </button>


          <button
            onClick={() => router.push('/login')}
            className="w-full p-2 bg-green-500 text-white rounded hover:cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}