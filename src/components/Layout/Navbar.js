import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || user?.email || 'Student';

  const handleLogout = () => {
    localStorage.removeItem('user');
    setMenuOpen(false);
    window.location.href = '/';
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">EngliLearn</Link>
      </div>

      <div className="navbar-toggle" onClick={toggleMenu}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      <div className={`navbar-right ${menuOpen ? 'active' : ''}`}>
        {user ? (
          <div className="user-info">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <span className="username">{userName}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
