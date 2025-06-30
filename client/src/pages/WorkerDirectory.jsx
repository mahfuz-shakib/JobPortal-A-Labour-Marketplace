import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const WorkerDirectory = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const params = {};
        if (category) params.category = category;
        if (location) params.location = location;
        const res = await axios.get('/api/user/workers', { params });
        setWorkers(res.data);
      } catch (err) {
        setWorkers([]);
      }
      setLoading(false);
    };
    fetchWorkers();
  }, [category, location]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center text-gray-100 px-2 py-8">
      <h2 className="text-2xl font-bold mb-6">Worker Directory</h2>
      <div className="flex gap-4 mb-6">
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g. electrician)" className="px-3 py-2 rounded text-gray-100 border border-gray-700" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="px-3 py-2 rounded text-gray-100 border border-gray-700" />
      </div>
      {loading ? <div>Loading...</div> : workers.length === 0 ? <div className="text-gray-400">No workers found.</div> : (
        <div className="w-full max-w-3xl grid gap-4 grid-cols-1 md:grid-cols-2">
          {workers.map(worker => (
            <div key={worker._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col gap-2">
              <div className="font-semibold text-lg text-blue-300">{worker.name}</div>
              <div className="text-gray-300">Category: {worker.category?.join(', ') || 'N/A'}</div>
              <div className="text-gray-400 text-sm">Location: {worker.location || 'N/A'}</div>
              <div className="text-yellow-400 text-sm">Rating: {worker.rating?.toFixed(1) || '0.0'}</div>
              <div className="text-gray-400 text-sm">Demandable Budget: {worker.demandableBudget ? `৳${worker.demandableBudget}` : 'Not set'}</div>
              <Link to={`/worker/${worker._id}`} className="text-blue-400 hover:underline text-sm">View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WorkerDirectory;