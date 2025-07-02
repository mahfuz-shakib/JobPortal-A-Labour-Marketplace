import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';

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
    <section className="min-h-screen w-full max-w-7xl flex flex-col items-center text-gray-900 px-2 py-8 bg-blue-50">
      <h2 className="text-2xl font-bold mb-6">Worker Lists</h2>
      <div className="flex gap-4 mb-6">
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g. electrician)" className="px-3 py-2 rounded text-gray-100 border border-gray-700" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="px-3 py-2 rounded text-gray-100 border border-gray-700" />
      </div>
      {loading ? <div>Loading...</div> : workers.length === 0 ? <div className="text-gray-400">No workers found.</div> : (
        <div className="w-full max-w-5xl grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          {workers.map(worker => {
            const card = worker.profileCard || {};
            const image = card.profileImage || worker.profilePic || '/public/images/default-profile.png';
            return (
              <div key={worker._id} className="w-full max-w-full sm:max-w-2xl bg-cyan-50 rounded-2xl shadow-xl p-2 xs:p-3 sm:p-6 grid grid-cols-2 gap-2 sm:gap-4 border border-gray-100 hover:shadow-2xl transition-all duration-200 relative mx-auto min-h-[180px] xs:min-h-[220px] sm:min-h-[320px]">
                {/* Left Section */}
                <div className="flex flex-col items-center sm:items-start w-full gap-2 xs:gap-3 sm:gap-4 min-w-0">
                  {/* Name & Pic */}
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 w-full min-w-0">
                    <img src={image} alt="Profile" className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-400 shadow shrink-0" />
                    <div className="font-bold truncate text-base xs:text-lg sm:text-2xl md:text-3xl text-blue-800 min-w-0">{worker.name}</div>
                  </div>
                  {/* Address, Salary, Available */}
                  <div className="flex flex-col gap-1 xs:gap-2 sm:gap-3 w-full mt-4 xs:mt-2 min-w-0">
                    <div className="flex items-center gap-3 xs:gap-2 text-gray-600 text-xs xs:text-sm sm:text-base min-w-0"><FaMapMarkerAlt className="text-blue-400" /> <span className="font-medium truncate">{card.address || 'N/A'}</span></div>
                    <div className="flex items-center gap-3 xs:gap-2 text-gray-600 text-xs xs:text-sm sm:text-base min-w-0"><FaMoneyBillWave className="text-green-500" /> <span className="font-medium truncate">{card.salaryDemand ? `৳${card.salaryDemand}` : 'Not set'}</span></div>
                    <div className="flex items-center gap-3 xs:gap-2 text-gray-600 text-xs xs:text-sm sm:text-base min-w-0">
                      {card.available ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                      <span className="font-medium truncate">{card.available ? 'Available' : 'Not Available'}</span>
                    </div>
                  </div>
                </div>
                {/* Right Section */}
                <div className="flex flex-col w-full gap-2 xs:gap-3 sm:gap-4 justify-between min-w-0">
                  {/* Rating at top right */}
                  <div className="flex items-center justify-end w-full">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm xs:text-base sm:text-lg"><FaStar /> {worker.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  {/* Skills vertically with bg */}
                  <div className="flex flex-col gap-1 xs:gap-2 mt-1 xs:mt-2 bg-pink-50 rounded-lg p-2 xs:p-3 sm:p-4 min-w-0">
                    <div className="text-gray-700 font-semibold mb-1 text-xs xs:text-sm sm:text-base">Skills:</div>
                    {card.skills && card.skills.length > 0 ? (
                      <ul className="flex flex-col gap-2">
                        {card.skills.map(skill => (
                          <li key={skill} className="flex items-center gap-3 xs:gap-2 text-blue-700 font-medium text-xs xs:text-sm sm:text-base"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>{skill}</li>
                        ))}
                      </ul>
                    ) : <div className="text-gray-400 text-xs xs:text-sm sm:text-base">N/A</div>}
                  </div>
                </div>
                {/* View Profile button at bottom left, responsive */}
                <div className="absolute left-2 xs:left-3 sm:left-6 bottom-2 xs:bottom-3 sm:bottom-6 flex justify-start">
                  <a href={`/worker/${worker._id}`} className="px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow text-center text-xs xs:text-sm sm:text-base">View Profile and Contact</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WorkerDirectory;