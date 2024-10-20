import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function Home() {
    const { user, setUser } = useUser();

  useEffect(() => {
    fetch('/api/auth/user')
      .then(response => response.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
          <LoginForm onLogin={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user}</h1>
          <div className="mt-6 space-y-4">
            <Link href="/request-time-off" className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center">
              Request Time Off
            </Link>
            <Link href="/profile" className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center">
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
