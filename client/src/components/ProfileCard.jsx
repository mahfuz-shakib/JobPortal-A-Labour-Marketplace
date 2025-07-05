import React from 'react';
import { FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';

const ProfileCard = ({ worker, onViewProfile, onContact }) => {
  const card = worker.profileCard || {};
  const image = card.profileImage || worker.profilePic || '/public/images/default-profile.png';
  return (
    <div className="w-full max-w-full sm:max-w-lg bg-cyan-50 rounded-2xl shadow-xl p-5 sm:p-7 flex flex-col border border-gray-100 hover:shadow-2xl transition-all duration-200 relative mx-auto min-h-[220px] sm:min-h-[220px] h-full">
      {/* Main content area grows to fill space */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-5">
        {/* Top: Pic and Name side-by-side */}
        <div className="flex flex-row items-center gap-5 sm:gap-6 w-full mb-2">
          <img src={image} alt="Profile" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-400 shadow shrink-0" />
          <div className="font-bold text-lg sm:text-xl md:text-2xl text-blue-800 break-words w-full text-left">{worker.name}</div>
        </div>
        {/* Two-column info section, fixed width columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full items-start">
          {/* Left: Location, Salary, Status, Rating */}
          <div className="flex flex-col gap-2 sm:gap-3 justify-start h-full min-h-[60px] sm:min-h-[100px] min-w-0 sm:min-w-[160px] sm:max-w-[200px] flex-1">
            <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base"><FaMapMarkerAlt className="text-blue-400" /> <span className="font-medium">{card.address || 'N/A'}</span></div>
            <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base"><FaMoneyBillWave className="text-green-500" /> <span className="font-medium">{card.salaryDemand ? `৳${card.salaryDemand}` : 'Not set'}</span></div>
            <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">{card.available ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}<span className="font-medium">{card.available ? 'Available' : 'Not Available'}</span></div>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-base sm:text-lg mt-1"><FaStar /> {worker.rating?.toFixed(1) || '0.0'}</div>
          </div>
          {/* Right: Skills */}
          <div className="flex flex-col h-full min-h-[60px] sm:min-h-[100px] min-w-0 sm:min-w-[160px] sm:max-w-[200px] flex-1">
            <div className="bg-pink-50 rounded-lg p-3 sm:p-4 w-full mb-1">
              <div className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">Skills:</div>
              {card.skills && card.skills.length > 0 ? (
                <ul className="flex flex-col gap-2 sm:gap-3">
                  {card.skills.map(skill => (
                    <li key={skill} className="flex items-center gap-2 text-blue-700 font-medium text-sm sm:text-base bg-blue-100 px-2 py-1 rounded-full"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>{skill}</li>
                  ))}
                </ul>
              ) : <div className="text-gray-400 text-sm sm:text-base">N/A</div>}
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons: left (View Profile), right (Hire/Contact), always at bottom */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 w-full">
        <button
          className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow text-center text-base sm:text-lg order-1"
          onClick={() => onViewProfile(worker)}
        >
          View Profile
        </button>
        <button
          className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow text-center text-base sm:text-lg order-2"
          onClick={() => onContact(worker)}
        >
          Hire / Contact
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
