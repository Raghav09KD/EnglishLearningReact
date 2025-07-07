import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import toast from 'react-hot-toast';
import request from '../../lib/api/request';
import { apiPaths } from '../../lib/api/apiPath';
import { paths } from '../../lib/path';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await request({
        method: "post",
        url: apiPaths.login,
        data: formData,
      });

      loginHandler(res, navigate);
    // const res = await axios.post('http://localhost:5000/api/auth/login', formData);
    // login(res.data.user, res.data.token);
    // localStorage.setItem('user', JSON.stringify(res.data));
    // console.log("🚀 ~ Login ~ res:", res);
    // navigate('/student/dashboard')
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};

const loginHandler = (res, navigate) => {
  const { user, token } = res || {};

  if (!user || !token) {
    toast.error("Invalid login response");
    return;
  }

  // Clear any previous auth
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Save new auth
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);

  toast.success(`Welcome, ${user.name}`);

  // Navigate based on role
  if (user.role === "admin") {
    navigate(paths.ADMIN_DASHBOARD);
  } else if (user.role === "student") {
    navigate(paths.STUDENT_DASHBOARD);
  } else {
    toast.error("Unknown role. Contact support.");
  }
};

return (
  <div className="auth-container">
    <div className="auth-card">
      <h2 className="title">Login</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          value={formData.email}
          className="input-field"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="input-field"
          required
        />
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <p className="login-redirect">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  </div>
);
};

export default Login;
