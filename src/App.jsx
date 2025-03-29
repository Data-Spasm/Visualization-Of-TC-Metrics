import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useParams} from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Classroom from './views/Classroom';
import Students from './views/Student';
import StudentList from './views/StudentList';
import PassageView from './views/PassageView';
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
    try {
      const teacherUsername = "arima2";
      const studentData = UserController.getStudentsByTeacher(teacherUsername);
      setStudents(studentData);

      const studentUsernames = studentData.map(s => s.username);
      const allAttempts = ReadingAttemptController.getAllAttempts();
      const filteredAttempts = allAttempts.filter(attempt =>
        studentUsernames.includes(attempt.studentUsername)
      );

      setReadingAttempts(filteredAttempts);

      const misreads = ReadingAttemptController.getMisreadWords(filteredAttempts);
      setMisreadWords(misreads);

      const allAssessments = ReadingAssessmentController.getAllAssessments();
      setAssessments(allAssessments);

      const miscues = filteredAttempts
        .filter(attempt => attempt?.expected && attempt?.actual)
        .map(attempt => {
          const result = assessAttempt(attempt.expected, attempt.actual);
          return {
            attemptId: attempt._id,
            miscues: result.miscues,
            highlightMap: result.highlightMap,
          };
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
                  element={
                    students.length > 0 ? (
                      <Classroom
                        students={students}
                        readingAttempts={readingAttempts}
                        misreadWords={misreadWords}
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
                      miscues={miscueData}
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

const PassageRouteWrapper = ({ students, readingAttempts, assessments }) => {
  const { studentUsername, passageId } = useParams();

  console.log("Route Params:", { studentUsername, passageId });

  const student = students.find(s => s.username === studentUsername);
  console.log("Matched Student:", student);

  const attempts = readingAttempts.filter(
    a => a.readingAssessmentId === passageId && a.studentUsername === studentUsername
  );
  console.log("Filtered Attempts for passage:", attempts);

  const miscues = attempts
    .filter(attempt => attempt.expected && attempt.actual)
    .map(attempt => {
      const result = assessAttempt(attempt.expected, attempt.actual);
      console.log(`Assessing Attempt ${attempt._id}:`, result);
      return {
        attemptId: attempt._id,
        miscues: result.miscues,
        highlightMap: result.highlightMap,
      };
    });

  const selectedAssessment = assessments.find(
    a => a._id?.$oid === passageId || a._id === passageId
  );
  console.log("Selected Assessment:", selectedAssessment);

  if (!student) console.warn("No matching student found.");
  if (attempts.length === 0) console.warn("No attempts found for this passage and student.");

  return student && attempts.length > 0 ? (
    <PassageView
      student={student}
      passageId={passageId}
      attempts={attempts}
      assessments={assessments}
      miscues={miscues}
      assessment={selectedAssessment}
      allAttempts={readingAttempts.filter(a => a.studentUsername === studentUsername)}
    />
  ) : (
    <h2>No passage data found.</h2>
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
