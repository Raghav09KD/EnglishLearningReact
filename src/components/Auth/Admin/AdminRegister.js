import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AdminRegister.css';

export default function AdminRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/adminAuth/register', formData);
      alert('Admin registered successfully. You can now login.');
      navigate('/Dashboard/AdminDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="title">Admin Sign Up</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleRegister} className="form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            value={formData.name}
            className="input-field"
            required
          />
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
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="login-redirect">Already an admin? <Link to="/admin/login">Login</Link></p>
      </div>
    </div>
  );
}
