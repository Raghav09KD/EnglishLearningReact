import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation  } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Navbar from './components/Layout/Navbar';
import AdminLogin from './components/Auth/Admin/AdminLogin';
import AdminRegister from './components/Auth/Admin/AdminRegister';
import AdminLayout from './components/Layout/AdminLayout ';
import GrammarManager from './components/Pages/Admin/GrammarManager';
import AdminNavbar from './components/Layout/AdminNavbar';
import VocabularyManager from './components/Pages/Admin/VocabularyManager';
import StoryManager from './components/Pages/Admin/StoryManager';
import PronunciationManager from './components/Pages/Admin/PronunciationManager';
import Home from './components/Pages/Student/Home';

// Student Modules & Layout
import SidebarLayout from './components/Layout/SidebarLayout';
import GrammarModule from './components/Pages/Student/GrammarModule';
import VocabularyModule from './components/Pages/Student/VocabularyModule';
import StoriesModule from './components/Pages/Student/StoriesModule';
import PronunciationModule from './components/Pages/Student/PronunciationModule';
import AdminAddCourse from './components/Pages/Admin/AddCources';


const AllRoutes = () => {
    const user = JSON.parse(localStorage.getItem('user'));

   const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

 const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect authenticated users away from login/register
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

    return (<Router>
      <Routes>

        {/* Home Route */}
        <Route path="/" element={<RequireAuth><Home/></RequireAuth>} />
        {/* <Route path="/" element={user ? <Navigate to="/student/dashboard" /> : <Home />} /> */}
  <Route path="/addCourse" element={<RequireAuth><AdminAddCourse/></RequireAuth>} />
        {/* Student Auth */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        {/* <Route path="/login" element={<AdminAddCourse />} /> */}

        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Student Layout with Sidebar */}
        <Route path="/student" element={<SidebarLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="grammar" element={<GrammarModule />} />
          <Route path="vocabulary" element={<VocabularyModule />} />
          <Route path="stories" element={<StoriesModule />} />
          <Route path="pronunciation" element={<PronunciationModule />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminNavbar />
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/dashboard/AdminDashboard"
          element={
            <AdminLayout>
              <AdminNavbar />
              <AdminDashboard />
            </AdminLayout>
          }
        />

        {/* Admin Pages */}
        <Route
          path="/admin/grammar"
          element={
            <AdminLayout>
              <AdminNavbar />
              <GrammarManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/vocabulary"
          element={
            <AdminLayout>
              <AdminNavbar />
              <VocabularyManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/stories"
          element={
            <AdminLayout>
              <AdminNavbar />
              <StoryManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/pronunciation"
          element={
            <AdminLayout>
              <AdminNavbar />
              <PronunciationManager />
            </AdminLayout>
          }
        />

      </Routes>
    </Router>)
}

export default AllRoutes;