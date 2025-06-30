import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SubmittedBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get('/api/bids/my');
        setBids(res.data);
      } catch (err) {
        setBids([]);
      }
      setLoading(false);
    };
    fetchBids();
  }, []);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-2">
      <h2 className="text-2xl font-bold mb-4">Submitted Bids</h2>
      {loading ? (
        <div>Loading...</div>
      ) : bids.length === 0 ? (
        <p className="text-gray-400">You have not submitted any bids yet.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {bids.map(bid => (
            <div key={bid._id} className="bg-gray-800 rounded-lg p-4 shadow border border-gray-700">
              <div className="font-semibold text-blue-300">{bid.job?.title || 'Job'}</div>
              <div className="text-gray-300">Amount: ${bid.amount}</div>
              <div className="text-sm text-gray-400">Status: {bid.status} | Message: {bid.message}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SubmittedBids; 