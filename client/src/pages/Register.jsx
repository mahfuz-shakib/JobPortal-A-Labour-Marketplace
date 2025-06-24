import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'client',
  });
  const [message, setMessage] = useState('');
  const { user, register, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\+?\d{10,15}$/.test(form.phone)) {
      setMessage('Please enter a valid phone number.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await register(form);
      await login(form.email, form.password);
      setMessage('Registration successful! Logging you in...');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setMessage(msg);
    }
    setLoading(false);
  };

  return (
    <section className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-blue-50 to-blue-100 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-blue-100">
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-2 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 8v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm">Join WorkMatch and start your journey.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">Name</label>
            <input name="name" id="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
            <input name="email" id="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="phone">Phone Number</label>
            <input name="phone" id="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="role">Role</label>
            <select name="role" id="role" value={form.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50">
              <option value="client">Client</option>
              <option value="worker">Worker</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input name="password" id="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input name="confirmPassword" id="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg shadow transition text-base flex items-center justify-center disabled:opacity-60 mt-2" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        {message && <p className="mt-6 text-center text-red-500 font-semibold text-base">{message}</p>}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
