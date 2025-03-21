import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import TimeOnTaskChart from "../components/barcharts/TimeOnTaskChart";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataLineGraph from "../components/linegraphs/ReadingAssessmentDataLineGraph";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import WordAccuracyDistributionChart from "../components/barcharts/WordAccuracyDistributionChart";
import User from "../controllers/User";
import ReadingAttempt from "../controllers/ReadingAttempt";
import "./Classroom.css";

const Classroom = () => {
  const [students, setStudents] = useState([]);
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [timeOnTaskData, setTimeOnTaskData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);
  const [readingAssessmentData, setReadingAssessmentData] = useState([]);
  const [readingAttempts, setReadingAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching classroom data...");

    // Fetch all students
    const studentData = User.getAllStudents();
    console.log("Fetched Students:", studentData);
    setStudents(studentData);

    // Fetch all reading attempts
    try {
      console.log("Calling ReadingAttempt.getAllAttempts()...");
      const attempts = ReadingAttempt.getAllAttempts();
      console.log("Fetched Reading Attempts:", attempts);
      if (!attempts || attempts.length === 0) {
        console.warn("Warning: No reading attempts found!");
      }
      setReadingAttempts(attempts);
    } catch (error) {
      console.error("Error fetching reading attempts:", error);
    }

    if (studentData.length > 0) {
      // Aggregate overall classroom performance
      const aggregatedPerformance = studentData.map(student => ({
        name: student.username,
        accuracy: student.student?.reading?.overallPerformance?.overallAccuracy || 0,
        fluency: student.student?.reading?.overallPerformance?.overallFluency || 0,
        timeOnTask: student.student?.reading?.overallPerformance?.overallTimeOnTask || 0,
      }));
      console.log("Aggregated Performance Data:", aggregatedPerformance);
      setOverallPerformanceData(aggregatedPerformance);

      // Aggregate time on task
      const timeData = aggregatedPerformance.map(({ name, timeOnTask }) => ({ name, timeOnTask }));
      console.log("Aggregated Time on Task Data:", timeData);
      setTimeOnTaskData(timeData);

      // Aggregate misread words across students
      const misreadWords = studentData.flatMap(student => student.student?.misreadWords || []);
      console.log("Aggregated Misread Words Data:", misreadWords);
      setMisreadData(misreadWords);

      // Aggregate reading assessment data
      const assessmentData = readingAttempts.length > 0 ? calculateReadingAssessmentData(readingAttempts) : [];
      console.log("Aggregated Reading Assessment Data:", assessmentData);
      setReadingAssessmentData(assessmentData);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <h2>Loading classroom data...</h2>;
  }

  if (!students || students.length === 0) {
    return <h2>No students found.</h2>;
  }

  if (!readingAttempts || readingAttempts.length === 0) {
    return <h2>No reading attempts found.</h2>;
  }

  return (
    <div className="classroom">
      <div className="long-card">
        <Card className="long-card">
          <CardContent className="long-card-content">
            <Typography gutterBottom variant="h4" component="div">
              Classroom Progress Overview
            </Typography>
            <div className="progress-reading-container">
              <ReadingProgressBar performance={overallPerformanceData} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid-container">
        <Card className="card">
          <CardContent>
            <OverallAccuracyFluencyChart data={overallPerformanceData} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <ClassEngagementBubbleChart readingAttempts={readingAttempts} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <WordAccuracyDistributionChart students={students} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <TopMisreadWordsChart data={misreadData} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <ReadingAssessmentDataLineGraph data={[readingAssessmentData]} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <ClassWideReadingPerformance students={students} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classroom;
