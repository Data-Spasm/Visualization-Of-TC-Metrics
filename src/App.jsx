import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useParams } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';

import Classroom from './views/Classroom';
import Students from './views/Student';
import StudentList from './views/StudentList';
import PassageView from './views/PassageView';

import { DataProvider, DataContext } from './context/DataContext';
import useAnalyticsEvent from './hooks/useAnalyticsEvent';
import './App.css';

// Grab session ID from sessionStorage
const getSessionUserId = () => {
  let sessionUserId = sessionStorage.getItem("userId");
  if (!sessionUserId) {
    sessionUserId = `User_${Math.floor(Math.random() * 10000)}_${Date.now()}`;
    sessionStorage.setItem("userId", sessionUserId);
  }
  return sessionUserId;
};

const App = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const { students, readingAttempts, assessments, miscues, loading } = useContext(DataContext);
  const trackEvent = useAnalyticsEvent("App");

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    trackEvent("toggle_sidebar", "Sidebar Toggled", isSidebarVisible ? 0 : 1);
  };

  // Set the GA session user ID on first mount
  useEffect(() => {
    const userId = getSessionUserId();
    if (window.gtag) {
      window.gtag('set', { user_id: userId });
    }
  }, []);

  return (
    <Router>
      <RouteChangeTracker />
      <div className="container">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="main-content">
          {isSidebarVisible && <Sidebar />}
          <div className={isSidebarVisible ? 'content' : 'content full'}>
            {loading ? (
              <div className="loading-screen">
                <h2>Loading classroom data...</h2>
                <div className="spinner" />
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/classroom" replace />} />
                <Route
                  path="/classroom"
                  element={
                    students.length > 0 ? (
                      <Classroom
                        students={students}
                        readingAttempts={readingAttempts}
                        assessments={assessments}
                      />
                    ) : (
                      <h2>No students found.</h2>
                    )
                  }
                />
                <Route
                  path="/student-list"
                  element={
                    <StudentList
                      students={students}
                      readingAttempts={readingAttempts}
                    />
                  }
                />
                <Route
                  path="/students/:id"
                  element={
                    <StudentRouteWrapper
                      students={students}
                      readingAttempts={readingAttempts}
                      assessments={assessments}
                      miscues={miscues}
                    />
                  }
                />
                <Route
                  path="/passages/:studentUsername/:passageId"
                  element={
                    <PassageRouteWrapper
                      students={students}
                      readingAttempts={readingAttempts}
                      assessments={assessments}
                      miscues={miscues}
                    />
                  }
                />
                <Route
                  path="/passages/:studentUsername"
                  element={
                    <PassageRouteWrapper
                      students={students}
                      readingAttempts={readingAttempts}
                      assessments={assessments}
                      miscues={miscues}
                    />
                  }
                />
              </Routes>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
};

const StudentRouteWrapper = ({ students, readingAttempts, assessments }) => {
  const { id } = useParams();
  const student = students.find(s => s._id?.$oid === id || s._id === id);

  return student ? (
    <Students
      student={student}
      allAssessmentAttempts={readingAttempts.filter(a => a.studentUsername === student.username)}
      assessments={assessments}
    />
  ) : (
    <h2>No student selected.</h2>
  );
};

const PassageRouteWrapper = ({ students, readingAttempts, assessments, miscues }) => {
  const { studentUsername, passageId } = useParams();

  const student = students.find(s => s.username === studentUsername);
  const selectedAssessment = assessments.find(
    a => a._id?.$oid === passageId || a._id === passageId
  );

  const studentAttempts = readingAttempts.filter(
    a => a.studentUsername === studentUsername
  );

  return student && studentAttempts.length > 0 ? (
    <PassageView
      student={student}
      passageId={passageId}
      attempts={studentAttempts.filter(a => a.readingAssessmentId === passageId)}
      assessments={assessments}
      allAttempts={studentAttempts}
      assessment={selectedAssessment}
    />
  ) : (
    <h2>No passage data found.</h2>
  );
};

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const userId = getSessionUserId();
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
        user_id: userId,
      });
    }
  }, [location]);

  return null;
};

export default App;
