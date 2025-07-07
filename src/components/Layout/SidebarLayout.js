import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './SidebarLayout.css';
import Navbar from './Navbar';
import { paths } from '../../lib/path';

const SidebarLayout = () => {
  return (
    <>
    {/* <Navbar/> */}
    <div className="layout-container">
      <aside className="sidebar">
        <nav className="nav-links">
          <NavLink to="/student/dashboard" className="link">Home</NavLink>
          <NavLink to="/student/progress" className="link">Progress</NavLink>
          <NavLink to="/student/badges" className="link">Vocabulary</NavLink>
          <NavLink to="/student/quiz" className="link">Stories</NavLink>
          <NavLink to={paths.COURSES} className="link">Courses</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
    </>
  );
};

export default SidebarLayout;
