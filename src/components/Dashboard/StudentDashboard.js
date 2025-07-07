import React from 'react';
import './StudentDashboard.css';
import { Link } from 'react-router-dom';
import Navbar from '../Layout/Navbar';

const modules = [
  { name: 'Grammar', route: '/grammar', color: '#6C63FF' },
  { name: 'Vocabulary', route: '/vocabulary', color: '#00B894' },
  { name: 'Stories', route: '/stories', color: '#0984E3' },
  { name: 'Pronunciation', route: '/pronunciation', color: '#E17055' },
];

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (

      <div className="dashboard-container">
        <h2>Welcome, {user?.name || "Student"}!</h2>
        <p>Select a module to begin learning:</p>

        <div className="modules-grid">
          {modules.map((mod) => (
            <Link key={mod.name} to={mod.route} className="module-card" style={{ backgroundColor: mod.color }}>
              <h3>{mod.name}</h3>
              <p>Start Learning →</p>
            </Link>
          ))}
        </div>
      </div>
  );
};

export default StudentDashboard;
