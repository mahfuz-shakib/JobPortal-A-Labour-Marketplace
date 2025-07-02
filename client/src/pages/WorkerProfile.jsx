import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await axios.get(`/api/user/worker/${id}`);
        setWorker(res.data);
        // Set document title
        document.title = `${res.data.name} - Worker Profile | WorkMatch`;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch worker profile');
        document.title = 'Worker Not Found | WorkMatch';
      }
      setLoading(false);
    };
    fetchWorker();
  }, [id]);

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-300">Loading worker profile...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !worker) {
    return (
      <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">
              {error || 'Worker not found'}
            </div>
            <Link 
              to="/workers"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Browse Workers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Worker Profile</h1>
          <p className="text-gray-400">View detailed information about this worker</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start gap-6">
                {worker.profilePic ? (
                  <img 
                    src={worker.profilePic} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-blue-500 shadow-lg">
                    {worker.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{worker.name}</h2>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {getRatingStars(worker.rating || 0)}
                      <span className="text-gray-400 text-sm ml-1">({worker.rating || 0})</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      worker.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {worker.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {worker.location && (
                    <div className="text-gray-400 text-sm flex items-center gap-1">
                      📍 {worker.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Experience & Skills</h3>
              <div className="space-y-4">
                {worker.experience && (
                  <div>
                    <h4 className="text-gray-300 font-semibold mb-2">Experience</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{worker.experience}</p>
                  </div>
                )}
                {worker.category && worker.category.length > 0 && (
                  <div>
                    <h4 className="text-gray-300 font-semibold mb-2">Skills & Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {worker.category.map((skill, index) => (
                        <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {worker.bio && (
                  <div>
                    <h4 className="text-gray-300 font-semibold mb-2">Bio</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{worker.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Work Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Demandable Budget</span>
                  <div className="text-white font-semibold text-lg">
                    {worker.demandableBudget ? `$${worker.demandableBudget}` : 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <div className="text-white font-semibold">
                    {new Date(worker.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Rating</span>
                  <div className="text-white font-semibold">
                    {worker.rating || 0}/5
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Status</span>
                  <div className="text-white font-semibold">
                    {worker.availability ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white break-all">{worker.email}</span>
                </div>
                {worker.phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{worker.phone}</span>
                  </div>
                )}
                {worker.location && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{worker.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Get in Touch</h3>
              <div className="space-y-3">
                {worker.phone && (
                  <a
                    href={`tel:${worker.phone}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    📞 Call Worker
                  </a>
                )}
                <a
                  href={`mailto:${worker.email}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  ✉️ Send Email
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-semibold">{worker.rating || 0}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    worker.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {worker.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Skills</span>
                  <span className="text-white font-semibold">{worker.category?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Browse More Workers */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Find More Workers</h3>
              <p className="text-gray-400 text-sm mb-4">
                Looking for other skilled workers? Browse our directory to find the perfect match for your project.
              </p>
              <Link
                to="/workers"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                Browse Workers Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkerProfile; 