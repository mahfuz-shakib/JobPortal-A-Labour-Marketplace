import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaStar, FaSearch, FaChevronDown } from 'react-icons/fa';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import ProfileCard from '../components/ProfileCard';

const WorkerDirectory = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(createApiUrl(API_ENDPOINTS.USER_WORKERS));
        setWorkers(res.data);
      } catch (err) {
        setWorkers([]);
      }
      setLoading(false);
    };
    fetchWorkers();
  }, []);

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

  // Filtering
  const filteredWorkers = workers.filter(worker => {
    const searchLower = search.toLowerCase();
    const card = worker.profileCard || {};
    return (
      (worker.name && worker.name.toLowerCase().includes(searchLower)) ||
      (card.address && card.address.toLowerCase().includes(searchLower)) ||
      (card.skills && card.skills.join(' ').toLowerCase().includes(searchLower))
    );
  });

  // Sorting (example: by newest, by rating)
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'ratingHigh') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'ratingLow') return (a.rating || 0) - (b.rating || 0);
    return 0;
  });

  return (
    <section className="min-h-screen w-full max-w-7xl flex flex-col items-center text-gray-900 px-2 py-8 bg-blue-50 mx-auto">
      <h2 className="text-3xl font-bold mb-6">Worker Listings</h2>
      {/* Modern Filter Bar */}
      <div className="flex justify-center mb-10 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg px-6 py-4 border border-gray-200">
          {/* Search Box */}
          <div className="flex items-center flex-1 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-green-200 transition">
            <FaSearch className="text-green-400 mr-3 text-lg" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search workers by name, location, or skill..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base font-semibold"
            />
          </div>
          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-56">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-base font-semibold shadow-sm focus:ring-2 focus:ring-green-200 focus:outline-none pr-8 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="ratingHigh">Rating: High to Low</option>
              <option value="ratingLow">Rating: Low to High</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>
      </div>
      {loading ? <div>Loading...</div> : sortedWorkers.length === 0 ? <div className="text-gray-400">No workers found.</div> : (
        <div className="w-full max-w-5xl grid gap-6 grid-cols-1 md:grid-cols-2">
          {sortedWorkers.map(worker => (
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