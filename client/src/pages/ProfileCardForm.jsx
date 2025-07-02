import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

const ProfileCardForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    skills: [],
    available: true,
    salaryDemand: '',
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally fetch existing profile card info to prefill form
    const fetchProfileCard = async () => {
      try {
        const res = await axios.get(`/api/user/worker/${user._id}`);
        if (res.data.profileCardCreated && res.data.profileCard) {
          setForm({
            address: res.data.profileCard.address || '',
            skills: res.data.profileCard.skills || [],
            available: res.data.profileCard.available !== undefined ? res.data.profileCard.available : true,
            salaryDemand: res.data.profileCard.salaryDemand || '',
            profileImage: res.data.profileCard.profileImage || ''
          });
          setImagePreview(res.data.profileCard.profileImage || res.data.profilePic || '');
        }
      } catch {}
    };
    if (user && user.role === 'worker') fetchProfileCard();
  }, [user]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillChange = e => {
    const value = e.target.value;
    setForm(f => f.skills.includes(value)
      ? { ...f, skills: f.skills.filter(s => s !== value) }
      : { ...f, skills: [...f.skills, value] });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, profileImage: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm(f => ({ ...f, profileImage: '' }));
      setImagePreview('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('/api/user/profile-card', form);
      setMessage('Profile card saved!');
      setTimeout(() => navigate('/workers'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save profile card.');
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8 flex flex-col items-center">
      <div className="max-w-xl w-full bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h1 className="text-2xl font-bold mb-6">Create/Edit Your Worker Profile Card</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Address (Bangladesh based) *</label>
            <input name="address" value={form.address} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., Dhaka, Chattogram, etc." />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Skills *</label>
            <div className="flex flex-wrap gap-2">
              {workCategories.map(skill => (
                <label key={skill} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" value={skill} checked={form.skills.includes(skill)} onChange={handleSkillChange} className="accent-blue-500" />
                  {skill}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Available</label>
            <select name="available" value={form.available} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Salary Demand (৳)</label>
            <input name="salaryDemand" value={form.salaryDemand} onChange={handleChange} type="number" min="0" className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., 5000" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Profile Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-lg border-2 border-blue-400 shadow" />}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile Card'}
          </button>
          {message && <div className="mt-3 text-center text-sm text-yellow-400">{message}</div>}
        </form>
      </div>
    </section>
  );
};

export default ProfileCardForm; 