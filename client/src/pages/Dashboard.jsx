import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg text-blue-700 font-semibold">
        You must be logged in to view your dashboard.
      </div>
    );

  return (
    <section className="w-full max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-gray-100">
          <h3 className="text-xl font-bold text-blue-700 mb-2">Welcome, <span className="text-blue-500">{user.name}</span>!</h3>
          <p className="text-gray-700 mb-2">
            {user.role === 'client'
              ? 'Here you can manage your posted jobs and view incoming bids.'
              : 'Here you can see your submitted bids and accepted jobs.'}
          </p>
          <div className="flex flex-col gap-3 mt-4">
            {user.role === 'client' ? (
              <>
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg shadow-sm">Posted Jobs (Coming Soon)</div>
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-sm">Incoming Bids (Coming Soon)</div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg shadow-sm">Submitted Bids (Coming Soon)</div>
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-sm">Accepted Jobs (Coming Soon)</div>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Overview</h3>
          <div className="flex flex-col gap-2 text-gray-600">
            <div><span className="font-semibold">Role:</span> <span className="capitalize">{user.role}</span></div>
            <div><span className="font-semibold">Email:</span> {user.email}</div>
            <div><span className="font-semibold">Phone:</span> {user.phone}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard; 