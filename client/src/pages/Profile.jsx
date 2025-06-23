import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Modal from 'react-modal';

const tabs = ["Overview", "Activity", "Settings"];

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Overview");
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skill: user?.skill || '',
    bio: user?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [picUploading, setPicUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) return <div className="text-center mt-10 text-white">You must be logged in to view your profile.</div>;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  const handlePicChange = async (e) => {
    setError(''); setSuccess('');
    if (e.target.files && e.target.files[0]) {
      setPicUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfilePic(reader.result);
        try {
          const res = await axios.post('/api/user/profile-pic', { profilePic: reader.result }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setSuccess('Profile picture updated!');
        } catch (err) { setError('Failed to upload profile picture.'); }
        setPicUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setShowEditModal(true);
  const handleCancel = () => {
    setShowEditModal(false);
    setEditMode(false);
    setForm({
      name: user.name,
      email: user.email,
      skill: user.skill || '',
      bio: user.bio || '',
    });
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(''); setSuccess('');
    if (!form.name || !form.email) {
      setError('Name and email are required.');
      setSaving(false);
      return;
    }
    try {
      const res = await axios.post('/api/user/profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEditMode(false);
      setShowEditModal(false);
      setSuccess('Profile updated!');
    } catch (err) { setError('Failed to update profile.'); }
    setSaving(false);
  };

  Modal.setAppElement('#root');

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 flex flex-col items-center py-10 px-4 md:min-h-screen border-b md:border-b-0 md:border-r border-gray-700">
        <div className="relative w-32 h-32 mb-4">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-600" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-800 flex items-center justify-center text-4xl font-bold border-4 border-blue-600">
              {initials}
            </div>
          )}
          <button
            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow"
            onClick={() => fileInputRef.current.click()}
            title="Change profile picture"
            disabled={picUploading}
          >
            {picUploading ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
              </svg>
            )}
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePicChange}
          />
        </div>
        <div className="text-2xl font-bold mb-1 text-center w-full break-words">{user.name}</div>
        <div className="text-blue-400 font-semibold mb-2 capitalize">{user.role}</div>
        <div className="text-gray-400 text-sm mb-6 text-center w-full break-words">{user.email}</div>
        <div className="flex flex-col gap-2 w-full">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full" onClick={handleEdit}>Edit Profile</button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded w-full">View Dashboard</button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 w-full px-4 py-10 md:py-16 flex flex-col items-center">
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700 mb-8 w-full max-w-3xl">
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
        {/* Tab Content */}
        <div className="w-full max-w-3xl">
          {(error || success) && (
            <div className={`mb-4 text-center font-semibold ${error ? 'text-red-400' : 'text-green-400'}`}>{error || success}</div>
          )}
          {activeTab === "Overview" && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-1">Name</label>
                  {editMode ? (
                    <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
                  ) : (
                    <div className="text-lg font-bold">{user.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Email</label>
                  {editMode ? (
                    <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
                  ) : (
                    <div>{user.email}</div>
                  )}
                </div>
                {user.role === 'worker' && (
                  <>
                    <div>
                      <label className="block text-gray-400 mb-1">Skill</label>
                      {editMode ? (
                        <input name="skill" value={form.skill} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
                      ) : (
                        <div>{user.skill}</div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1">Bio</label>
                      {editMode ? (
                        <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
                      ) : (
                        <div>{user.bio}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                {editMode ? (
                  <>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button type="button" onClick={handleCancel} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">Cancel</button>
                  </>
                ) : null}
              </div>
            </form>
          )}
          {activeTab === "Activity" && (
            <div className="space-y-4">
              {user.role === 'client' ? (
                <>
                  <div className="bg-gray-800 p-4 rounded">Jobs Posted (Coming Soon)</div>
                  <div className="bg-gray-800 p-4 rounded">Bids Received (Coming Soon)</div>
                </>
              ) : (
                <>
                  <div className="bg-gray-800 p-4 rounded">Jobs Applied (Coming Soon)</div>
                  <div className="bg-gray-800 p-4 rounded">Accepted Jobs (Coming Soon)</div>
                </>
              )}
            </div>
          )}
          {activeTab === "Settings" && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded">Change Password (Coming Soon)</div>
              <div className="bg-gray-800 p-4 rounded">Notification Settings (Coming Soon)</div>
            </div>
          )}
        </div>
        <Modal
          isOpen={showEditModal}
          onRequestClose={handleCancel}
          contentLabel="Edit Profile"
          className="bg-gray-900 rounded-lg p-8 max-w-lg mx-auto mt-20 outline-none border border-gray-700 shadow-xl"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Edit Profile</h2>
          {error && <div className="mb-2 text-red-400 text-center font-semibold">{error}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" required />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" required />
            </div>
            {user.role === 'worker' && (
              <>
                <div>
                  <label className="block text-gray-400 mb-1">Skill</label>
                  <input name="skill" value={form.skill} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
                </div>
              </>
            )}
            <div className="flex space-x-2 mt-4">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={handleCancel} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default Profile; 