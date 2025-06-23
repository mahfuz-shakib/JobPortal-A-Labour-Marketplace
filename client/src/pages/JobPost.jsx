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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />
        <input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget" type="number" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Post Job</button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default JobPost; 