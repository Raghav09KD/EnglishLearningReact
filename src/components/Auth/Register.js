import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Register.css';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      login(res.data.user, res.data.token);
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

 return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="title">Sign Up</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="name" placeholder="Your Name" onChange={handleChange} value={formData.name} className="input-field" required />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} value={formData.email} className="input-field" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} className="input-field" required />
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="login-redirect">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
