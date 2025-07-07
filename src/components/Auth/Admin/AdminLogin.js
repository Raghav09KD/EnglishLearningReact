import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AdminAuthContext } from '../../../context/authAdmin';
import './AdminLogin.css';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AdminAuthContext);


  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/adminAuth/login', formData);
      console.log("🚀 ~ handleLogin ~ res:", res)
      loginAdmin(res.data.admin);
      localStorage.setItem('token', res.data.token);
      navigate('/Dashboard/AdminDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="title">Admin Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin} className="form">
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
        <p className="login-redirect">New admin? <Link to="/admin/register">Register</Link></p>
      </div>
    </div>
  );
}
