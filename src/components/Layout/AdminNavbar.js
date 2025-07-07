import React, { useContext, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AdminAuthContext } from '../../context/authAdmin';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { adminUser, logoutAdmin } = useContext(AdminAuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin(); 
    navigate('/admin'); // redirect to admin dashboard
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="admin-navbar">
      <h1 className="admin-logo">Admin Panel</h1>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`admin-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active-link' : '')}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/grammar" className={({ isActive }) => (isActive ? 'active-link' : '')}>Grammar Lessons</NavLink>
        </li>
        <li>
          <NavLink to="/admin/vocabulary" className={({ isActive }) => (isActive ? 'active-link' : '')}>Vocabulary</NavLink>
        </li>
        <li>
          <NavLink to="/admin/stories" className={({ isActive }) => (isActive ? 'active-link' : '')}>Story Content</NavLink>
        </li>
        <li>
          <NavLink to="/admin/pronunciation" className={({ isActive }) => (isActive ? 'active-link' : '')}>Pronunciation</NavLink>
        </li>
        <li>
          {adminUser ? (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          ) : (
            <NavLink to="/admin/login" className="nav-link">Login</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
