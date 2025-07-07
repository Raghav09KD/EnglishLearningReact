import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../lib/path";

export default function AuthNavbar() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(paths.LOGIN);
  };

    const getInitial = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };


  return (
        <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
        Engli<span className="text-gray-800">Learn</span>
      </Link>

           <div className="flex items-center gap-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
            {getInitial(user?.name)}
          </div>
          <span className="text-sm text-gray-600">
            Hi, <span className="font-medium">{user?.name}</span>
          </span>
        </div>

        {user?.role === "admin" ? (
          <Link
            to={paths.ADMIN_DASHBOARD}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium"
          >
            Admin Panel
          </Link>
        ) : (
          <Link
            to={paths.STUDENT_DASHBOARD}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium"
          >
            My Course
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-600 transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
