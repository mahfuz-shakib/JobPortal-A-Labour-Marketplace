import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await axios.get(`/api/user/worker/${id}`);
        setWorker(res.data);
      } catch (err) {
        setWorker(null);
      }
      setLoading(false);
    };
    fetchWorker();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-300">Loading...</div>;
  if (!worker) return <div className="text-center mt-10 text-red-400">Worker not found.</div>;

  return (
    <section className="min-h-[60vh] flex flex-col items-center bg-gray-900 text-gray-100 px-2 py-8">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-xl border border-gray-700">
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-900 flex items-center justify-center overflow-hidden mb-2 ring-2 ring-blue-700 shadow">
            {worker.profilePic ? <img src={worker.profilePic} alt="Profile" className="w-20 h-20 object-cover rounded-full" /> : <span className="text-3xl font-bold text-blue-200">{worker.name[0]}</span>}
          </div>
          <div className="font-bold text-xl text-blue-200">{worker.name}</div>
          <div className="text-gray-400 text-sm mb-1">{worker.location || 'N/A'}</div>
          <div className="text-yellow-400 text-sm mb-1">Rating: {worker.rating?.toFixed(1) || '0.0'}</div>
          <div className="text-green-400 text-xs mb-2">{worker.availability ? 'Available' : 'Unavailable'}</div>
        </div>
        <div className="mb-2"><span className="font-semibold">Category:</span> {worker.category?.join(', ') || 'N/A'}</div>
        <div className="mb-2"><span className="font-semibold">Experience:</span> {worker.experience || 'N/A'}</div>
        <div className="mb-2"><span className="font-semibold">Demandable Budget:</span> {worker.demandableBudget ? `৳${worker.demandableBudget}` : 'No demandable budget set'}</div>
        <button className="mt-4 w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">Hire</button>
      </div>
    </section>
  );
};

export default WorkerProfile; 