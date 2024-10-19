import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './Components/Navbar';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import { useState } from 'react';
import constents from './Common/constents';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Screens/Home';
import AdminDashboard from './Screens/AdminDashboard';
import UserCoursesPage from './Screens/UserCoursesPage';
import CourseDetailsPage from './Screens/CourseDetailsPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [Auth, setAuth] = useState(constents.getUserDetails())
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar Auth={Auth} setAuth={setAuth} />
        <Routes>
          <Route path="/" element={<Home Auth={Auth} setAuth={setAuth} />} />
          <Route path="/dashboard" element={<AdminDashboard Auth={Auth} setAuth={setAuth} />} />
          <Route path="/signup" element={<SignUp Auth={Auth} setAuth={setAuth} />} />
          <Route path="/signin" element={<SignIn Auth={Auth} setAuth={setAuth} />} />
          <Route path="/your-courses" element={<UserCoursesPage Auth={Auth} setAuth={setAuth} />} />
          <Route path="/course-details/:courseId" element={<CourseDetailsPage Auth={Auth} setAuth={setAuth} />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
