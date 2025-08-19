import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '', server: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    const password = form.password.trim();
    let hasError = false;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      hasError = true;
    }

    if (password.length < 6 || /\s/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 6 characters and no spaces',
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', { email, password });
      const { token, user, roleAndPermission } = response.data;

      // Save to localStorage
      // localStorage.setItem('token', token);

      // Save to Redux
      dispatch(login({ token, user, roleAndPermission }));

      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setErrors((prev) => ({ ...prev, server: message }));
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#314f5c] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#031a24]">Login</h2>

        {errors.server && <div className="mb-4 text-red-500 text-sm text-center">{errors.server}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={form.email} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" required />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" value={form.password} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••" required />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-[#305361] text-white py-2 rounded-lg hover:bg-[#1d323a] transition duration-200">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
