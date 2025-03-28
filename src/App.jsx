import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Classroom from './views/Classroom';
import Students from './views/Student';
import StudentList from './views/StudentList';
import UserController from './controllers/User';
import ReadingAttemptController from './controllers/ReadingAttempt';
import ReadingAssessmentController from './controllers/ReadingAssessment';
import { assessAttempt } from './utils/assessAttempt';
import './App.css';

const trackEvent = (eventName, eventParams = {}, eventType = "click") => {
  if (window.gtag) {
    window.gtag("event", eventType, {
      event_category: "User Interaction",
      event_label: eventParams.label || '',
      value: eventParams.value || '',
      ...eventParams,
    });
  }
};

const App = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [students, setStudents] = useState([]);
  const [readingAttempts, setReadingAttempts] = useState([]);
  const [misreadWords, setMisreadWords] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [miscueData, setMiscueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching classroom data...");

    try {
      const teacherUsername = "arima2";
      const studentData = UserController.getStudentsByTeacher(teacherUsername);
      console.log(`Fetched Students for Teacher "${teacherUsername}":`, studentData);
      setStudents(studentData);

      const studentUsernames = studentData.map(s => s.username);

      const allAttempts = ReadingAttemptController.getAllAttempts();
      const filteredAttempts = allAttempts.filter(attempt =>
        studentUsernames.includes(attempt.studentUsername)
      );

      console.log("Filtered Reading Attempts:", filteredAttempts);
      setReadingAttempts(filteredAttempts);

      console.log("Extracting misread words...");
      const misreads = ReadingAttemptController.getMisreadWords(filteredAttempts);
      console.log("Fetched Misread Words:", misreads);
      setMisreadWords(misreads);

      const allAssessments = ReadingAssessmentController.getAllAssessments();
      console.log("Fetched Reading Assessments:", allAssessments);
      setAssessments(allAssessments);

      const miscues = filteredAttempts.map(attempt => {
        const { expected, actual } = attempt;
        const results = assessAttempt(expected, actual);
        return { passageId: attempt.passageId, studentUsername: attempt.studentUsername, miscues: results.miscues };
      });
      setMiscueData(miscues);

      setLoading(false);
      trackEvent('load_students', { label: 'Students Loaded' });
      trackEvent('load_reading_attempts', { label: 'Reading Attempts Loaded' });

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
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
            {loading ? (
              <h2>Loading classroom data...</h2>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/classroom" replace />} />
                <Route
                  path="/classroom"
                  element={students.length > 0 ? (
                    <Classroom
                      students={students}
                      readingAttempts={readingAttempts}
                      misreadWords={misreadWords}
                      assessments={assessments}
                    />
                  ) : (
                    <h2>No students found.</h2>
                  )}
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
                  element={<StudentRouteWrapper students={students} readingAttempts={readingAttempts} assessments={assessments} miscues={miscueData} />}
                />
              </Routes>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
};

const StudentRouteWrapper = ({ students, readingAttempts, assessments, miscues }) => {
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