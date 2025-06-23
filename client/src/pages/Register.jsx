import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    skill: '',
    bio: '',
  });
  const [message, setMessage] = useState('');
  const { user, register, login } = useContext(AuthContext);
  const navigate = useNavigate();

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
    try {
      await register(form);
      await login(form.email, form.password);
      setMessage('Registration successful! Logging you in...');
      // navigation will happen via useEffect
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="client">Client</option>
          <option value="worker">Worker</option>
        </select>
        {form.role === 'worker' && (
          <>
            <input name="skill" value={form.skill} onChange={handleChange} placeholder="Skill (e.g. Electrician)" className="w-full p-2 border rounded" required={form.role==='worker'} />
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio" className="w-full p-2 border rounded" />
          </>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default Register; 