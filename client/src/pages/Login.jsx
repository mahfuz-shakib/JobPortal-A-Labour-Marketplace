import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const { user, login } = useContext(AuthContext);
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
    setLoading(true);
    setMessage('');
    try {
      await login(form.email, form.password);
      setMessage('Login successful!');
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        setMessage('Email not registered or password is incorrect.');
      } else {
        setMessage(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <section className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-blue-50 to-blue-100 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-blue-100">
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-2 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0V8a4 4 0 10-8 0v4m8 0a4 4 0 01-8 0m8 0v4a4 4 0 01-8 0v-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
            <input name="email" id="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required autoFocus />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input name="password" id="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none bg-blue-50" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg shadow transition text-base flex items-center justify-center disabled:opacity-60 mt-2" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        {message && <p className="mt-6 text-center text-red-500 font-semibold text-base">{message}</p>}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">Sign up</Link>
        </div>
      </div>
    </section>
  );
};

export default Login;