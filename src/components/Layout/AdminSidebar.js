import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-3">
        <Link to="/admin/grammar" className="block hover:text-blue-300">Grammar Lessons</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
