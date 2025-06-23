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

  if (loading) return <div className="text-center mt-10">Loading jobs...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map(job => (
            <li key={job._id} className="p-4 bg-white rounded shadow">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-gray-600">Location: {job.location}</p>
              <p className="text-gray-600">Budget: ${job.budget}</p>
              <p className="text-gray-600">Status: {job.status}</p>
              <p className="text-gray-600">Client: {job.client?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList; 