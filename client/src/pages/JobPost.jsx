import React, { useState } from 'react';
import axios from 'axios';

const JobPost = () => {
  const [form, setForm] = useState({ title: '', description: '', location: '', budget: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Job posted successfully!');
      setForm({ title: '', description: '', location: '', budget: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Job post failed');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[70vh] bg-white rounded-xl shadow-lg p-6 sm:p-10 max-w-lg mx-auto mt-10">
      <div className="w-full">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Post a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="title">Title</label>
            <input name="title" id="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="description">Description</label>
            <textarea name="description" id="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="location">Location</label>
            <input name="location" id="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="budget">Budget</label>
            <input name="budget" id="budget" value={form.budget} onChange={handleChange} placeholder="Budget" type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow transition text-lg">Post Job</button>
        </form>
        {message && <p className={`mt-6 text-center font-semibold ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
      </div>
    </section>
  );
};

export default JobPost; 