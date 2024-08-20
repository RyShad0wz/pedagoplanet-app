import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Header from './components/Header';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import RoleSelection from './components/auth/RoleSelection';
import UserProviderWithNavigate from './contexts/UserProviderWithNavigate'; 
import CourseList from './components/CourseList';
import CourseDetails from './components/CourseDetails';
import StudentGrades from './components/StudentGrades';
import UserProfile from './components/UserProfile';
import CreateCourse from './components/CreateCourse';
import AvailableCourses from './components/AvailableCourses';
import Grades from './components/Grades';
import CourseGrades from './components/CourseGrades';
import Chat from './components/Chat';
import AssignmentDetails from './components/AssignmentDetails';
import TeacherNews from './components/TeacherNews';
import StudentNews from './components/StudentNews';
import CreateNews from './components/CreateNews';
import RedirectBasedOnRole from './components/RedirectBasedOnRole';

import './App.css';
import './axiosConfig';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <UserProviderWithNavigate>
                    <Header />
                    <RedirectBasedOnRole /> {}
                    <main style={{ marginTop: '64px' }}>
                        <ToastContainer />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<RoleSelection />} />
                            <Route path="/register/:role" element={<Register />} />
                            <Route path="/student-dashboard" element={<StudentDashboard />} />
                            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                            <Route path="/teacher-dashboard/courses" element={<CourseList />} />
                            <Route path="/courses/:courseId" element={<CourseDetails />} />
                            <Route path="/courses/:courseId/student-grades" element={<StudentGrades />} />
                            <Route path="/create-course" element={<CreateCourse />} />
                            <Route path="/available-courses" element={<AvailableCourses />} />
                            <Route path="/student-dashboard/grades" element={<Grades />} />
                            <Route path="/grades/:courseId" element={<CourseGrades />} />
                            <Route path="/profile/:userId" element={<UserProfile />} />
                            <Route path="/message/:userId/:receiverId" element={<Chat />} />
                            <Route path="/assignments/:assignmentId" element={<AssignmentDetails />} />
                            <Route path="/teacher-news" element={<TeacherNews />} />
                            <Route path="/student-news" element={<StudentNews />} />
                            <Route path="/create-news" element={<CreateNews />} />
                        </Routes>
                    </main>
                </UserProviderWithNavigate>
            </Router>
        </ThemeProvider>
    );
}

export default App;
