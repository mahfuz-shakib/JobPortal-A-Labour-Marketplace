import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="text-center mt-10">You must be logged in to view your dashboard.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {user.role === 'client' ? (
        <>
          <p className="mb-4">Welcome, <span className="font-semibold">{user.name}</span>! Here you can manage your posted jobs and view incoming bids.</p>
          <div className="bg-gray-100 p-4 rounded mb-2">Posted Jobs (Coming Soon)</div>
          <div className="bg-gray-100 p-4 rounded">Incoming Bids (Coming Soon)</div>
        </>
      ) : (
        <>
          <p className="mb-4">Welcome, <span className="font-semibold">{user.name}</span>! Here you can see your submitted bids and accepted jobs.</p>
          <div className="bg-gray-100 p-4 rounded mb-2">Submitted Bids (Coming Soon)</div>
          <div className="bg-gray-100 p-4 rounded">Accepted Jobs (Coming Soon)</div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 