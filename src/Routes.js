
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import AdminLogin from './components/Auth/Admin/AdminLogin';
import AdminRegister from './components/Auth/Admin/AdminRegister';
import Home from './components/Pages/Student/Home';

import AddVoiceCourses from './pages/VoiceCourses/AddVoiceCourses';
// Student Modules & Layout
import AdminAddCourse from './components/Pages/Admin/AddCources';
import CourcesList from './pages/Course/CourcesList/CourcesList';
import CourseDetails from './pages/Course/CourseDetails/CourseDetials';
import { paths } from './lib/path';
import Layout from './components/Layout/Layout';
import SpeechPractice from './pages/Course/SpeechRecognisation/SpeechPractice';
import CreateSpeechPractice from './pages/Course/SpeechRecognisation/AddSpeech';
import SpeechPracticeList from './pages/Course/SpeechRecognisation/SpeechPractiseList';
import AdminProgress from './pages/UserProgress/UserProgress';
import AdminUserTable from './pages/Users/UsersList';
import AdminCoursesTable from './pages/Course/AdminCourseTable/AdminCourses';
import AdminSpeechPractise from './pages/SpeechPractise/AdminPractiseList';
import EachUserProgress from './pages/UserProgress/EachUserProgress';
import VoiceCoursesList from './pages/VoiceCourses/ListeningCourseList';
import VoiceCoursePlayer from './pages/VoiceCourses/ListeningCourseDetails';
import TeacherStudentManagement from './pages/Users/UsrManagent';
import { AuthContext } from './context/AuthContext';
import ResetPassword from './components/ResetPassword';
import AdminSignup from './pages/Users/AdminSignUp';
import AdminVoiceCourses from './pages/VoiceCourses/ManageVoiceCourses';
import TeacherCourseManagement from './pages/Users/teacherCourse';
import AdminCourseTable from './pages/Course/AdminCourseTable/AdminCourseTable';
import TeacherCourseManager from './pages/Course/TeacherCourseManagement';

const AllRoutes = () => {
  const { user, logout } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  function PrivateRoute({ children, allowedRoles }) {
    const { user, logout } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" replace />;

    // Check if user's role is allowed for this route
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  const PublicRoute = ({ children }) => {
    const { user, logout } = useContext(AuthContext);

    // Redirect authenticated users away from login/register
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  function DashboardRouter() {

    if (!user) return <Navigate to="/login" />;

    if (user.role === "admin" || user.role === 'teacher') return <AdminDashboard />;
    if (user.role === "student") return <StudentDashboard />;

    return <div>Unauthorized role</div>; // fallback if role is weird
  }
  console.log(user)

  return (<Router>
    <Routes>
      <Route element={<Layout />}>
        {/* Home Route */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />


        <Route path={paths.ADD_COURSE} element={<PrivateRoute allowedRoles={["admin", 'teacher']}><AdminAddCourse /></PrivateRoute>} />
        {/* Student Auth */}
        <Route path={paths.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/courses" element={<PrivateRoute allowedRoles={["admin", 'student', 'teacher']}><CourcesList /></PrivateRoute>} />
        <Route path={paths.MANAGE_COURSE} element={<PrivateRoute allowedRoles={["admin", 'teacher']}><AdminCoursesTable /></PrivateRoute>} />
        <Route path={paths.TEACHER_MANAGE_COURSE_ASSIGNMENTS} element={<PrivateRoute allowedRoles={['teacher']}><TeacherCourseManager /></PrivateRoute>} />


        <Route path="/courses/:id" element={<PrivateRoute allowedRoles={["admin", 'student']}><CourseDetails /></PrivateRoute>} />

        {/* <Route path="/login" element={<AdminAddCourse />} /> */}

        <Route path="/register" element={<PublicRoute ><Register /></PublicRoute>} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardRouter />
            </RequireAuth>
          }
        />

        <Route path={paths.ADMIN_USER_TABLE} element={<PrivateRoute allowedRoles={["admin", 'teacher']}><AdminUserTable /></PrivateRoute>} />

        <Route path={paths.ADMIN_COURSE_TABLE} element={<PrivateRoute allowedRoles={['teacher']}><AdminCourseTable /></PrivateRoute>} />


        {/* speech practise */}
        <Route path={paths.PRACTISE_SPEECH} element={<PrivateRoute allowedRoles={["admin", 'student']}><SpeechPractice /></PrivateRoute>} />
        <Route path={paths.MANAGE_SPEECH_PRACTISE} element={<PrivateRoute allowedRoles={["admin", 'teacher']}><AdminSpeechPractise /></PrivateRoute>} />

        <Route path={paths.CREATE_SPEECH_PRACTISE} element={<PrivateRoute allowedRoles={["admin", 'teacher']}><CreateSpeechPractice /></PrivateRoute>} />
        <Route path={paths.LIST_SPEECH_PRACTISE} element={<PrivateRoute allowedRoles={["admin", "student"]}><SpeechPracticeList /></PrivateRoute>} />

        {/* Voice Courses */}
        <Route path={paths.ADD_LISTENING_PRACTISE} element={<PrivateRoute allowedRoles={["admin", 'teacher']}><AddVoiceCourses /></PrivateRoute>} />
        <Route path={paths.LISTENING_COURSE_LIST} element={<PrivateRoute allowedRoles={["student"]}><VoiceCoursesList /></PrivateRoute>} />
        <Route path={paths.LISTENING_COURSE_DETAILS} element={<PrivateRoute allowedRoles={["student"]}><VoiceCoursePlayer /></PrivateRoute>} />
        <Route path={paths.MANAGE_VOICE_COURSES} element={<PrivateRoute allowedRoles={["admin",'teacher']}><AdminVoiceCourses /></PrivateRoute>} />



        {/* Student Layout with Sidebar */}
        <Route path="/student" >
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path={paths.STUDENT_PROGRESS} element={<PrivateRoute allowedRoles={['student']}><EachUserProgress /></PrivateRoute>} />

        <Route path={paths.USER_MANAGEMENT} element={<PrivateRoute allowedRoles={['admin']}><TeacherStudentManagement /></PrivateRoute>} />

        <Route path={paths.TEACHER_COURSE_MANAGEMENT} element={<PrivateRoute allowedRoles={['admin']}><TeacherCourseManagement /></PrivateRoute>} />


        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/Viewprogress" element={<PrivateRoute allowedRoles={['admin']}><AdminProgress /></PrivateRoute>} />


        <Route path={paths.ADMIN_SIGN_UP} element={<PublicRoute allowedRoles={['student']}><AdminSignup /></PublicRoute>} />




      </Route>
    </Routes>
  </Router>)
}

export default AllRoutes;