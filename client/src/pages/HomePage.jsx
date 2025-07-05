import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PublicHomePage from './PublicHomePage';
import WorkerHomePage from './WorkerHomePage';
import ClientHomePage from './ClientHomePage';

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show public home page
  if (!user) {
    return <PublicHomePage />;
  }

  // If user is authenticated, show role-based home page
  if (user.role === 'worker') {
    return <WorkerHomePage />;
  }

  if (user.role === 'client') {
    return <ClientHomePage />;
  }

  // Fallback to public home page if role is not recognized
  return <PublicHomePage />;
};

export default HomePage;
