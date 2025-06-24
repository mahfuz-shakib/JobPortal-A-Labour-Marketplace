import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg text-blue-600 font-semibold">Loading jobs...</div>;

  return (
    <section className="w-full max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">Job Listings</h2>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-2xl transition border border-gray-100">
              <h3 className="text-xl font-bold text-blue-700 mb-1">{job.title}</h3>
              <p className="text-gray-700 flex-1">{job.description}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Location: {job.location}</span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">Budget: ${job.budget}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Status: {job.status}</span>
                {job.client?.name && <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full">Client: {job.client.name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default JobList; 