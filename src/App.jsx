import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Classroom from './views/Classroom';
import Students from './views/Student';
import { loadStudentData, loadReadingAttempts, loadReadingSkills } from './utils/loadData';
import './App.css';

// Google Analytics Event Tracking Function
const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'User Interaction',
      event_label: eventParams.label || '',
      value: eventParams.value || '',
      ...eventParams,
    });
  }
};

const App = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [student, setStudent] = useState(null);
  const [readingAttempts, setReadingAttempts] = useState([]);
  const [readingSkills, setReadingSkills] = useState(null);

  useEffect(() => {
    // Load student data
    const studentData = loadStudentData();
    console.log("Loaded Student Data:", studentData);
    setStudent(studentData);
    trackEvent('load_student_data', { label: 'Student Data Loaded' });

    // Load reading attempts
    const attemptsData = loadReadingAttempts();
    console.log("Loaded Reading Attempts:", attemptsData);
    setReadingAttempts(attemptsData);
    trackEvent('load_reading_attempts', { label: 'Reading Attempts Loaded' });

    // Load reading skills
    const skillsData = loadReadingSkills();
    console.log("Loaded Reading Skills:", skillsData);
    setReadingSkills(skillsData);
    trackEvent('load_reading_skills', { label: 'Reading Skills Loaded' });
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    trackEvent('toggle_sidebar', { label: 'Sidebar Toggled', value: isSidebarVisible ? 0 : 1 });
  };

  return (
    <Router>
      <RouteChangeTracker />
      <div className="container">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="main-content">
          {isSidebarVisible && <Sidebar />}
          <div className={isSidebarVisible ? 'content' : 'content full'}>
            <Routes>
              {/* Redirect from "/" to "/classroom" */}
              <Route path="/" element={<Navigate to="/classroom" replace />} />
              <Route 
                path="/classroom" 
                element={student ? <Classroom student={student} /> : <h2>Loading...</h2>} 
              />
              <Route 
                path="/students" 
                element={student ? <Students student={student} readingSkills={readingSkills} /> : <h2>Loading...</h2>} 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

// Component to track route changes and send data to Google Analytics
const RouteChangeTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

export default App;
