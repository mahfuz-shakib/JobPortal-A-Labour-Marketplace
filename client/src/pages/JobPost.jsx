import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const JobPost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    workCategory: '',
    workDuration: '',
    workersNeeded: 1,
    requirements: '',
    applicationDeadline: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobImage, setJobImage] = useState();
  const [jobImagePreview, setJobImagePreview] = useState();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJobImage(reader.result);
        setJobImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setJobImage(undefined);
      setJobImagePreview(undefined);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await axios.post(createApiUrl(API_ENDPOINTS.JOBS), { ...form, jobImage });
      setMessage('Job posted successfully!');
      setTimeout(() => {
        navigate(`/jobs/${res.data._id}`);
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to post job.');
    }
    setLoading(false);
  };

  const workCategories = [
    'Cooking/Catering',
    'Cook/Chef',
    'Masonry',
    'Electrical',
    'Plumbing',
    'Painting',
    'Carpentry',
    'Cleaning',
    'Construction',
    'Moving & Packing',
    'Roofing',
    'Flooring',
    'Welding',
    'Demolition',
    'Gardening',
    'Delivery',
    'Loading/Unloading',
    'Maintenance',
    'Helping Hand',
    'Other'
  ];

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Post a Labor Job</h1>
          <p className="text-gray-400">Find workers for your labor needs</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Job Title *
              </label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="e.g., House Cleaning, Garden Work, Moving Help" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Job Description *
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Describe the work needed and specific tasks..." 
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                required 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location *
                </label>
                <input 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  placeholder="e.g., Downtown, Rural area, Specific address" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Budget ($) *
                </label>
                <input 
                  name="budget" 
                  value={form.budget} 
                  onChange={handleChange} 
                  placeholder="e.g., 50, 100, 200" 
                  type="number" 
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Work Category *
                </label>
                <select 
                  name="workCategory" 
                  value={form.workCategory} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  required
                >
                  <option value="">Select work category</option>
                  {workCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Workers Needed
                </label>
                <input 
                  name="workersNeeded" 
                  value={form.workersNeeded} 
                  onChange={handleChange} 
                  type="number" 
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Work Duration *
              </label>
              <input 
                name="workDuration" 
                value={form.workDuration} 
                onChange={handleChange} 
                placeholder="e.g., 2 hours, Full day, 3 days" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Application Deadline (optional)
              </label>
              <input 
                name="applicationDeadline" 
                value={form.applicationDeadline} 
                onChange={handleChange} 
                type="date" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="When should workers submit their bids by?"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Requirements
              </label>
              <textarea 
                name="requirements" 
                value={form.requirements} 
                onChange={handleChange} 
                placeholder="Tools needed, physical requirements, safety gear, certifications, etc." 
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>

            {/* Optional Job Image Upload */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Job Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {jobImagePreview && (
                <img src={jobImagePreview} alt="Job Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border-2 border-blue-400 shadow" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? 'Posting Job...' : 'Post Labor Job'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/jobs')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-lg font-semibold ${
              message.includes('successfully') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default JobPost;
