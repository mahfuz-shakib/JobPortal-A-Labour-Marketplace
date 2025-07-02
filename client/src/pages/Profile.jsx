import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [editSection, setEditSection] = useState(null); // 'personal', 'professional', 'account', 'password', or null
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    skill: user?.skill || '',
    bio: user?.bio || '',
    profilePic: user?.profilePic || null,
    email: user?.email || '',
    organizationType: user?.organizationType || '',
    organizationName: user?.organizationName || '',
    location: user?.location || '',
    description: user?.description || '',
  });
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePic || null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [emailEdit, setEmailEdit] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [deletePassword, setDeletePassword] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  if (!user) return <div className="text-center mt-10 text-white">You must be logged in to view your profile.</div>;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  // Profile picture editing
  const handlePicChange = (e) => {
    setError(''); setSuccess('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
        setForm(f => ({ ...f, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Inline editing handlers
  const handleEdit = (section) => {
    setEditSection(section);
    setError(''); setSuccess('');
  };
  const handleCancel = () => {
    setEditSection(null);
    setForm({
      name: user.name,
      phone: user.phone || '',
      skill: user.skill || '',
      bio: user.bio || '',
      profilePic: user.profilePic || null,
      email: user.email || '',
      organizationType: user.organizationType || '',
      organizationName: user.organizationName || '',
      location: user.location || '',
      description: user.description || '',
    });
    setProfilePicPreview(user.profilePic || null);
    setProfilePicFile(null);
    setEmailEdit(false);
    setEmailInput(user.email || '');
    setPasswordForm({ currentPassword: '', newPassword: '' });
    setPasswordMsg('');
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async (section) => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const res = await axios.post('/api/user/profile', {
        name: form.name,
        phone: form.phone,
        profilePic: form.profilePic,
        category: form.category,
        experience: form.experience,
        demandableBudget: form.demandableBudget,
        bio: form.bio,
        organizationType: form.organizationType,
        organizationName: form.organizationName,
        location: form.location,
        description: form.description,
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEditSection(null);
      setSuccess('Profile updated successfully!');
      setProfilePicFile(null);
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to update profile.'); 
    }
    setSaving(false);
  };

  // Email change
  const handleEmailSave = async () => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const res = await axios.post('/api/user/change-email', { newEmail: emailInput });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEmailEdit(false);
      setSuccess('Email updated! Please log in again.');
      setTimeout(() => { logout(); }, 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update email.';
      setError(msg);
    }
    setSaving(false);
  };

  // Password change
  const handlePasswordSave = async () => {
    setSaving(true);
    setPasswordMsg('');
    try {
      await axios.post('/api/user/change-password', passwordForm);
      setPasswordMsg('Password updated! Please log in again.');
      setTimeout(() => { logout(); }, 2000);
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || 'Failed to update password.');
    }
    setSaving(false);
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      await axios.post('/api/user/delete', { currentPassword: deletePassword });
      setSuccess('Account deleted. Logging out...');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account.');
    }
    setSaving(false);
    setShowDeleteConfirm(false);
    setDeletePassword('');
  };

  // Tabs for main content
  const tabs = ['Personal Info', 'Professional Info', 'Account Info', 'Activity/Stats'];

  return (
    <section className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      {/* Sidebar: vertical tab list */}
      <aside className="w-full md:w-1/4 bg-white flex flex-col items-center py-10 px-4 md:min-h-screen border-b md:border-b-0 md:border-r border-gray-200 shadow-sm">
        {/* User info */}
        <div className="relative w-28 h-28 mb-4 group mx-auto">
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 shadow-lg" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-800 flex items-center justify-center text-4xl font-bold border-4 border-blue-600 shadow-lg text-white">
              {initials}
            </div>
          )}
        </div>
        <div className="text-xl font-bold mb-1 text-center w-full break-words">{user.name}</div>
        <div className="text-gray-500 text-sm mb-6 text-center w-full break-words">{user.email}</div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold mb-8" onClick={logout}>Logout</button>
        {/* Tab list below user info and logout */}
        <div className="w-full flex flex-col gap-2 mt-2 border-t pt-8 border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-lg transition border-l-4 ${activeTab === tab ? 'bg-blue-50 border-blue-600 text-blue-700 shadow' : 'border-transparent text-gray-500 hover:bg-blue-100 hover:text-blue-600'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </aside>
      {/* Main Content: tab content on the right */}
      <main className="flex-1 w-full px-4 py-10 md:py-16 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {(error || success) && (
            <div className={`mb-4 text-center font-semibold ${error ? 'text-red-500' : 'text-green-600'}`}>{error || success}</div>
          )}
          {activeTab === 'Personal Info' && (
            <section className="rounded-xl p-6 mb-6 shadow border border-gray-100 bg-white relative">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">Personal Info</h3>
              {!editSection && (
                <button className="absolute top-6 right-6 text-blue-500 hover:text-blue-700 font-semibold" onClick={() => setEditSection('personal')}>Edit</button>
              )}
              {/* Name */}
              <div className="mb-4 flex items-center">
                <label className="w-32 font-semibold text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  required
                  placeholder="Your name"
                  disabled={editSection !== 'personal'}
                />
              </div>
              {/* Phone */}
              <div className="mb-4 flex items-center">
                <label className="w-32 font-semibold text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  required
                  placeholder="Your phone number"
                  disabled={editSection !== 'personal'}
                />
              </div>
              {/* Profile Picture */}
              <div className="mb-4 flex items-center">
                <label className="w-32 font-semibold text-gray-700">Profile Picture</label>
                <div className="flex items-center gap-4 flex-1">
                  <img src={profilePicPreview || user.profilePic} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-600" />
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicChange} className="block" disabled={editSection !== 'personal'} />
                </div>
              </div>
              {/* Email (read-only, change in Account Info) */}
              <div className="mb-4 flex items-center">
                <label className="w-32 font-semibold text-gray-700">Email</label>
                <input
                  value={user.email}
                  className="p-2 rounded border border-gray-200 bg-gray-100 flex-1 text-gray-500"
                  disabled
                />
              </div>
              {editSection === 'personal' && (
                <div className="flex gap-2 justify-end mt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => handleSave('personal')} disabled={saving}>Save</button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </section>
          )}
          {activeTab === 'Professional Info' && user.role === 'worker' && (
            <section className="rounded-xl p-6 mb-6 shadow border border-gray-100 bg-white relative">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">Professional Info</h3>
              {!editSection && (
                <button className="absolute top-6 right-6 text-blue-500 hover:text-blue-700 font-semibold" onClick={() => setEditSection('professional')}>Edit</button>
              )}
              {/* Category */}
              <div className="mb-4 flex items-center">
                <label className="w-40 font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  placeholder="e.g. electrician, plumber"
                  required
                  disabled={editSection !== 'professional'}
                />
              </div>
              <div className="text-xs text-gray-400 mb-4 ml-40">Popular Bangladeshi categories: electrician, plumber, mason, cook, driver, tailor, carpenter, cleaner, painter, AC mechanic, computer technician.</div>
              {/* Experience */}
              <div className="mb-4 flex items-center">
                <label className="w-40 font-semibold text-gray-700">Experience</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  placeholder="e.g. 5 years"
                  disabled={editSection !== 'professional'}
                />
              </div>
              {/* Demandable Budget */}
              <div className="mb-4 flex items-center">
                <label className="w-40 font-semibold text-gray-700">Demandable Budget</label>
                <input
                  name="demandableBudget"
                  value={form.demandableBudget}
                  onChange={handleChange}
                  type="number"
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  placeholder="e.g. 1000"
                  disabled={editSection !== 'professional'}
                />
              </div>
              {/* Bio */}
              <div className="mb-4 flex items-center">
                <label className="w-40 font-semibold text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  placeholder="Tell us about yourself"
                  disabled={editSection !== 'professional'}
                />
              </div>
              {/* Location */}
              <div className="mb-4 flex items-center">
                <label className="w-40 font-semibold text-gray-700">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 flex-1"
                  placeholder="e.g. Dhaka, Bangladesh"
                  disabled={editSection !== 'professional'}
                />
              </div>
              {/* Rating (read-only) */}
              <div className="mb-4 flex items-center">
                <label className="w-40 font-semibold text-gray-700">Rating</label>
                <input
                  value={user.rating?.toFixed(1) || '0.0'}
                  className="p-2 rounded border border-gray-200 bg-gray-100 flex-1 text-yellow-500 font-bold"
                  disabled
                />
              </div>
              {editSection === 'professional' && (
                <div className="flex gap-2 justify-end mt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => handleSave('professional')} disabled={saving}>Save</button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </section>
          )}
          {activeTab === 'Professional Info' && user.role === 'client' && (
            <section className="bg-white rounded-lg p-6 mb-6 shadow relative">
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center gap-2">Organization Info</h3>
              {!editSection && (
                <button className="absolute top-6 right-6 text-blue-500 hover:text-blue-700 font-semibold" onClick={() => setEditSection('organization')}>Edit</button>
              )}
              {/* Organization Name */}
              <div className="mb-2">
                <label className="block text-gray-500 mb-1">Organization Name</label>
                <input name="organizationName" value={form.organizationName || ''} onChange={handleChange} className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none" placeholder="e.g. Acme Corp or John Doe" disabled={editSection !== 'organization'} />
              </div>
              {/* Organization Type */}
              <div className="mb-2">
                <label className="block text-gray-500 mb-1">Organization Type</label>
                <input name="organizationType" value={form.organizationType || ''} onChange={handleChange} className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none" placeholder="e.g. Business, Individual, Nonprofit" disabled={editSection !== 'organization'} />
              </div>
              {/* Location */}
              <div className="mb-2">
                <label className="block text-gray-500 mb-1">Location</label>
                <input name="location" value={form.location || ''} onChange={handleChange} className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none" placeholder="e.g. Dhaka, Bangladesh" disabled={editSection !== 'organization'} />
              </div>
              {/* Description */}
              <div className="mb-2">
                <label className="block text-gray-500 mb-1">Description</label>
                <textarea name="description" value={form.description || ''} onChange={handleChange} className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none" placeholder="Describe your organization (optional)" disabled={editSection !== 'organization'} />
              </div>
              {editSection === 'organization' && (
                <div className="flex gap-2 mt-2 justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => handleSave('organization')} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </section>
          )}
          {activeTab === 'Account Info' && (
            <section className="bg-white rounded-lg p-6 mb-6 shadow relative">
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center gap-2">Account Info</h3>
              {!editSection && (
                <button className="absolute top-6 right-6 text-blue-500 hover:text-blue-700 font-semibold" onClick={() => setEditSection('account')}>Edit</button>
              )}
              {/* Email */}
              <div className="mb-2">
                <label className="block text-gray-500 mb-1 flex items-center gap-1">Email</label>
                <input name="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none" required disabled={editSection !== 'account'} />
              </div>
              {/* Password */}
              <div className="mb-2">
                <label className="block text-gray-500 mb-1 flex items-center gap-1">Password</label>
                <input name="currentPassword" value={passwordForm.currentPassword} onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} type="password" placeholder="Current Password" className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none mb-2" required disabled={editSection !== 'account'} />
                <input name="newPassword" value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} type="password" placeholder="New Password" className="w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none" required disabled={editSection !== 'account'} />
              </div>
              {editSection === 'account' && (
                <div className="flex gap-2 mt-2 justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleEmailSave} disabled={saving}>Save</button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              )}
              {/* Delete Account */}
              <div className="mt-6">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
                {showDeleteConfirm && (
                  <div className="mt-4 bg-white border border-gray-200 rounded p-4 text-center shadow">
                    <div className="mb-2 text-red-500 font-semibold">Are you sure you want to delete your account? This cannot be undone.</div>
                    <input
                      type="password"
                      className="w-full p-2 mb-3 border border-gray-300 rounded"
                      placeholder="Enter current password"
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      disabled={saving}
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2 font-semibold" onClick={handleDeleteAccount} disabled={saving || !deletePassword}>Yes, Delete</button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}>Cancel</button>
                  </div>
                )}
              </div>
            </section>
          )}
          {activeTab === 'Activity/Stats' && (
            <section className="bg-white rounded-lg p-6 mb-6 shadow">
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center gap-2">Activity & Stats</h3>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-blue-800 text-white px-6 py-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm">Jobs Posted</div>
                </div>
                <div className="bg-blue-800 text-white px-6 py-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm">Bids</div>
                </div>
                <div className="bg-blue-800 text-white px-6 py-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm">Ratings</div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </section>
  );
};

export default Profile; 