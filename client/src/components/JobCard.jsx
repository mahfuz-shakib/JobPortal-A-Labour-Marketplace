import React from 'react';

const JobCard = ({ job, onBid, onDetails }) => {
  const client = job.client || {};
  const ownerName = client.organizationName || client.name || 'Unknown';
  const ownerPic = client.profilePic || '/public/images/default-profile.png';

  const formatDate = (dateString) => {
    if (!dateString || dateString === '') return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 relative group w-full max-w-lg min-h-[180px] sm:min-h-[240px] md:min-h-[300px] lg:min-h-[300px] max-h-[350px]">
      {/* Main content area grows to fill space, no scrollbar */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-2 min-h-0">
        {/* Header: Image left, title and owner stacked right */}
        <div className="flex items-center gap-2 sm:gap-3 mb-1">
          {job.jobImage ? (
            <img src={job.jobImage} alt="Job" className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover border-2 border-blue-200 shadow-sm" />
          ) : (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center text-lg sm:text-2xl font-bold text-blue-700 border-2 border-blue-200 shadow-sm">
              {ownerName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col justify-center gap-y-0.5 sm:gap-y-1">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">{job.title}</span>
            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base leading-tight group-hover:text-blue-600 transition-colors">{ownerName}</span>
            <span className="text-xs text-gray-400 italic">{client.organizationType || ''}</span>
          </div>
        </div>
        
        {/* Job Description Preview (one line) */}
        <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-1 md:mb-2 truncate">{job.description}</p>
        
        {/* Two Section Layout: Left and Right */}
        <div className="flex gap-4 mb-1 md:mb-2">
          {/* Left Section: Location and Vacancy */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-semibold text-sm flex items-center">
              <span className="mr-2">📍</span>
              {job.location}
            </div>
            {job.workersNeeded > 0 && (
              <div className="bg-pink-50 text-pink-700 px-3 py-2 rounded-lg font-semibold text-sm flex items-center">
                <span className="mr-2">👥</span>
                {job.workersNeeded} {job.workersNeeded === 1 ? 'Vacancy' : 'Vacancies'}
              </div>
            )}
          </div>
          
          {/* Right Section: Salary and Deadline */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold text-sm flex items-center">
              <span className="mr-2">💰</span>
              ৳{job.budget}
            </div>
            {job.applicationDeadline && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-semibold text-sm flex items-center">
                <span className="mr-2">⏰</span>
                {formatDate(job.applicationDeadline)}
              </div>
            )}
          </div>
        </div>
        
        {/* Status Tag */}
        <div className="absolute top-3 sm:top-5 right-3 sm:right-5">
          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm border border-gray-200 ${
            job.status === 'Open' ? 'bg-green-50 text-green-700' :
            job.status === 'Assigned' ? 'bg-blue-50 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {job.status}
          </span>
        </div>
      </div>
      
      {/* Actions always at bottom */}
      <div className="flex gap-2 sm:gap-3 mt-auto pt-2">
        {onBid && (
          <button
            className="flex-1 bg-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow transition text-xs sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => onBid(job)}
          >
            Bid
          </button>
        )}
        {onDetails && (
          <button
            className="flex-1 bg-white border border-blue-200 text-blue-700 font-semibold px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow hover:bg-blue-50 transition text-xs sm:text-base md:text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => onDetails(job)}
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard; 