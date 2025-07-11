import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import CourcesList from './pages/Course/CourcesList/CourcesList';
import CourseDetails from './pages/Course/CourseDetails/CourseDetials';
import { paths } from './lib/path';
import Layout from './components/Layout/Layout';
import SpeechPractice from './pages/Course/SpeechRecognisation/SpeechPractice';
import CreateSpeechPractice from './pages/Course/SpeechRecognisation/AddSpeech';
import SpeechPracticeList from './pages/Course/SpeechRecognisation/SpeechPractiseList';
import AdminProgress from './pages/UserProgress/UserProgress';


const AllRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const RequireAuth = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  function PrivateRoute({ children, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <Navigate to="/login" replace />;

    // Check if user's role is allowed for this route
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  const PublicRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Redirect authenticated users away from login/register
    if (user) {
      return <Navigate to="/student/dashboard" replace />;
    }

    return children;
  };

  return (<Router>
    <Routes>
      <Route element={<Layout />}>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        <Route path={paths.ADD_COURSE} element={<PrivateRoute allowedRoles={["admin"]}><AdminAddCourse /></PrivateRoute>} />
        {/* Student Auth */}
        <Route path={paths.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/courses" element={<PrivateRoute allowedRoles={["admin", 'student']}><CourcesList /></PrivateRoute>} />
        <Route path="/courses/:id" element={<PrivateRoute allowedRoles={["admin", 'student']}><CourseDetails /></PrivateRoute>} />

        {/* <Route path="/login" element={<AdminAddCourse />} /> */}

        <Route path="/register" element={<PublicRoute ><Register /></PublicRoute>} />

        {/* speech practise */}
        <Route path={paths.PRACTISE_SPEECH} element={<PrivateRoute allowedRoles={["admin", 'student']}><SpeechPractice /></PrivateRoute>} />
        <Route path={paths.CREATE_SPEECH_PRACTISE} element={<PrivateRoute allowedRoles={["admin"]}><CreateSpeechPractice /></PrivateRoute>} />
        <Route path={paths.LIST_SPEECH_PRACTISE} element={<PrivateRoute allowedRoles={["admin", "student"]}><SpeechPracticeList /></PrivateRoute>} />

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
        <Route path="/admin/Viewprogress" element={<PrivateRoute allowedRoles={['admin']}><AdminProgress /></PrivateRoute>} />


        {/* Admin Dashboard */}
        <Route
          path={paths.ADMIN_DASHBOARD}
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout>
                {/* <AdminNavbar /> */}
                <AdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path={paths.ADMIN_DASHBOARD}
          element={
            <AdminLayout>
              {/* <AdminNavbar /> */}
              <AdminDashboard />
            </AdminLayout>
          }
        />

        {/* Admin Pages */}
        <Route
          path="/admin/grammar"
          element={
            <AdminLayout>
              {/* <AdminNavbar /> */}
              <GrammarManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/vocabulary"
          element={
            <AdminLayout>
              {/* <AdminNavbar /> */}
              <VocabularyManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/stories"
          element={
            <AdminLayout>
              {/* <AdminNavbar /> */}
              <StoryManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/pronunciation"
          element={
            <AdminLayout>
              {/* <AdminNavbar /> */}
              <PronunciationManager />
            </AdminLayout>
          }
        />
      </Route>
    </Routes>
  </Router>)
}

export default AllRoutes;