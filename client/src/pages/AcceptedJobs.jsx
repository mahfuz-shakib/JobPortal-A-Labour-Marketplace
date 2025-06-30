import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AcceptedJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs/accepted');
        setJobs(res.data);
      } catch (err) {
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-2">
      <h2 className="text-2xl font-bold mb-4">Accepted Jobs</h2>
      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <p className="text-gray-400">You have not been accepted for any jobs yet.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-gray-800 rounded-lg p-4 shadow border border-gray-700">
              <div className="font-semibold text-lg text-blue-300 mb-1">{job.title}</div>
              <div className="text-gray-300 mb-1">{job.description}</div>
              <div className="text-sm text-gray-400">Location: {job.location} | Budget: ${job.budget} | Status: {job.status}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AcceptedJobs; 