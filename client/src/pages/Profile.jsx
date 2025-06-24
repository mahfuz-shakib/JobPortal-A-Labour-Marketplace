import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

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
  const fileInputRef = useRef();

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
    if (section === 'personal' && (!form.name || !form.phone)) {
      setError('Name and phone are required.');
      setSaving(false);
      return;
    }
    try {
      const res = await axios.post('/api/user/profile', {
        name: form.name,
        phone: form.phone,
        skill: form.skill,
        bio: form.bio,
        profilePic: form.profilePic,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEditSection(null);
      setSuccess('Profile updated!');
      setProfilePicFile(null);
    } catch (err) { setError('Failed to update profile.'); }
    setSaving(false);
  };

  // Email change
  const handleEmailSave = async () => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const res = await axios.post('/api/user/change-email', { newEmail: emailInput }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEmailEdit(false);
      setSuccess('Email updated! Please log in again.');
      setTimeout(() => { logout(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email.');
    }
    setSaving(false);
  };

  // Password change
  const handlePasswordSave = async () => {
    setSaving(true);
    setPasswordMsg('');
    try {
      await axios.post('/api/user/change-password', passwordForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
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
      await axios.delete('/api/user/delete', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Account deleted. Logging out...');
      setTimeout(() => { logout(); }, 1500);
    } catch (err) {
      setError('Failed to delete account.');
    }
    setSaving(false);
    setShowDeleteConfirm(false);
  };

  // Tabs for main content
  const tabs = ['Personal Info', 'Professional Info', 'Account Info', 'Activity/Stats'];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-800 flex flex-col items-center py-10 px-4 md:min-h-screen border-b md:border-b-0 md:border-r border-gray-700">
        <div className="relative w-36 h-36 mb-4 group">
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-blue-600 shadow-lg" />
          ) : (
            <div className="w-36 h-36 rounded-full bg-blue-800 flex items-center justify-center text-5xl font-bold border-4 border-blue-600 shadow-lg">
              {initials}
            </div>
          )}
          <button
            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow opacity-90 group-hover:opacity-100"
            onClick={() => editSection === 'personal' && fileInputRef.current.click()}
            title="Change profile picture"
            disabled={saving || editSection !== 'personal'}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePicChange}
            disabled={editSection !== 'personal'}
          />
        </div>
        <div className="text-2xl font-bold mb-1 text-center w-full break-words">{user.name}</div>
        <div className="text-blue-400 font-semibold mb-2 capitalize">{user.role}</div>
        <div className="text-gray-400 text-sm mb-6 text-center w-full break-words">{user.email}</div>
        <div className="flex flex-col gap-2 w-full">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full" onClick={logout}>Logout</button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full mt-2" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
          {showDeleteConfirm && (
            <div className="mt-2 bg-gray-900 border border-gray-700 rounded p-4 text-center">
              <div className="mb-2 text-red-400 font-semibold">Are you sure you want to delete your account? This cannot be undone.</div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2" onClick={handleDeleteAccount} disabled={saving}>Yes, Delete</button>
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 w-full px-4 py-10 md:py-16 flex flex-col items-center">
        <div className="flex space-x-4 border-b border-gray-700 mb-8 w-full max-w-4xl">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`pb-2 px-2 text-lg font-semibold transition border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-blue-300'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="w-full max-w-4xl">
          {(error || success) && (
            <div className={`mb-4 text-center font-semibold ${error ? 'text-red-400' : 'text-green-400'}`}>{error || success}</div>
          )}
          {activeTab === 'Personal Info' && (
            <section className="bg-gray-800 rounded-lg p-6 mb-6 shadow flex flex-col md:flex-row md:items-center md:gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">Personal Info
                  {editSection !== 'personal' && (
                    <button className="ml-2 text-blue-400 hover:text-blue-200" onClick={() => handleEdit('personal')} title="Edit Personal Info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                      </svg>
                    </button>
                  )}
                </h3>
                {editSection === 'personal' ? (
                  <>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" required />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" required />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicChange} className="block" />
                        {profilePicPreview && <img src={profilePicPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-600" />}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => handleSave('personal')} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                      <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold">{user.name}</div>
                    <div className="text-gray-400">{user.phone}</div>
                  </>
                )}
              </div>
            </section>
          )}
          {activeTab === 'Professional Info' && user.role === 'worker' && (
            <section className="bg-gray-800 rounded-lg p-6 mb-6 shadow">
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">Professional Info
                {editSection !== 'professional' && (
                  <button className="ml-2 text-blue-400 hover:text-blue-200" onClick={() => handleEdit('professional')} title="Edit Professional Info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                    </svg>
                  </button>
                )}
              </h3>
              {editSection === 'professional' ? (
                <>
                  <div className="mb-2">
                    <label className="block text-gray-400 mb-1">Skill</label>
                    <input name="skill" value={form.skill} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-400 mb-1">Bio</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => handleSave('professional')} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Skill</label>
                    <div>{user.skill}</div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-gray-400 mb-1">Bio</label>
                    <div>{user.bio}</div>
                  </div>
                </>
              )}
            </section>
          )}
          {activeTab === 'Account Info' && (
            <section className="bg-gray-800 rounded-lg p-6 mb-6 shadow">
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">Account Info
                {!emailEdit && (
                  <button className="ml-2 text-blue-400 hover:text-blue-200" onClick={() => setEmailEdit(true)} title="Edit Email">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                    </svg>
                  </button>
                )}
              </h3>
              <div className="mb-2">
                <label className="block text-gray-400 mb-1 flex items-center gap-1">Email</label>
                {emailEdit ? (
                  <div className="flex gap-2">
                    <input name="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" required />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleEmailSave} disabled={saving}>Save</button>
                    <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <input name="email" value={user.email} readOnly disabled className="w-full p-2 rounded bg-gray-900 text-gray-400 border border-gray-700 cursor-not-allowed" />
                )}
              </div>
              <div className="mb-2">
                <label className="block text-gray-400 mb-1 flex items-center gap-1">Password</label>
                {editSection === 'password' ? (
                  <div className="flex flex-col gap-2">
                    <input name="currentPassword" value={passwordForm.currentPassword} onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} type="password" placeholder="Current Password" className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" required />
                    <input name="newPassword" value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} type="password" placeholder="New Password" className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700" required />
                    <div className="flex gap-2 mt-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handlePasswordSave} disabled={saving}>Save</button>
                      <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                    </div>
                    {passwordMsg && <div className="text-center text-sm mt-2 font-semibold text-blue-400">{passwordMsg}</div>}
                  </div>
                ) : (
                  <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded" onClick={() => handleEdit('password')}>Change Password</button>
                )}
              </div>
            </section>
          )}
          {activeTab === 'Activity/Stats' && (
            <section className="bg-gray-800 rounded-lg p-6 mb-6 shadow">
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">Activity & Stats</h3>
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
    </div>
  );
};

export default Profile; 