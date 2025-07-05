import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import ProfileCard from '../components/ProfileCard';

const WorkerDirectory = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const params = {};
        if (category) params.category = category;
        if (location) params.location = location;
        const res = await axios.get(createApiUrl(API_ENDPOINTS.USER_WORKERS), { params });
        setWorkers(res.data);
      } catch (err) {
        setWorkers([]);
      }
      setLoading(false);
    };
    fetchWorkers();
  }, [category, location]);

  const handleViewProfile = (worker) => {
    navigate(`/worker/${worker._id}`);
  };

  const handleContact = (worker) => {
    if (!user) {
      navigate('/login', { state: { from: `/worker/${worker._id}` } });
      return;
    }
    navigate(`/worker/${worker._id}`);
  };

  return (
    <section className="min-h-screen w-full max-w-7xl flex flex-col items-center text-gray-900 px-2 py-8 bg-blue-50">
      <h2 className="text-2xl font-bold mb-6">Worker Lists</h2>
      <div className="flex gap-4 mb-6">
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g. electrician)" className="px-3 py-2 rounded text-gray-100 border border-gray-700" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="px-3 py-2 rounded text-gray-100 border border-gray-700" />
      </div>
      {loading ? <div>Loading...</div> : workers.length === 0 ? <div className="text-gray-400">No workers found.</div> : (
        <div className="w-full max-w-5xl grid gap-6 grid-cols-1 md:grid-cols-2">
          {workers.map(worker => (
            <ProfileCard 
              key={worker._id} 
              worker={worker} 
              onViewProfile={handleViewProfile}
              onContact={handleContact}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default WorkerDirectory;