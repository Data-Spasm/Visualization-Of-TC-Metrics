import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Classroom from './views/Classroom';
import Students from './views/Student';
import { loadStudentData, loadReadingAttempts, loadReadingSkills } from './utils/loadData';
import './App.css';

const App = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [student, setStudent] = useState(null);
  const [readingAttempts, setReadingAttempts] = useState([]);
  const [readingSkills, setReadingSkills] = useState(null);

  useEffect(() => {
    const studentData = loadStudentData();
    console.log("Loaded Student Data:", studentData);
    setStudent(studentData);

    const attemptsData = loadReadingAttempts();
    console.log("Loaded Reading Attempts:", attemptsData);
    setReadingAttempts(attemptsData);

    const skillsData = loadReadingSkills();
    console.log("Loaded Reading Skills:", skillsData);
    setReadingSkills(skillsData);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <Router>
      <div className="container">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="main-content">
          {isSidebarVisible && <Sidebar />}
          <div className={isSidebarVisible ? 'content' : 'content full'}>
            <Routes>
              {/* Redirect from "/" to "/classroom" */}
              <Route 
                path="/" 
                element={<Navigate to="/classroom" replace />} />
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

export default App;