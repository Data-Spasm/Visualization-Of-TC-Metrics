import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import TimeOnTaskChart from "../components/barcharts/TimeOnTaskChart";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataLineGraph from "../components/linegraphs/ReadingAssessmentDataLineGraph";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import "./Classroom.css";

const Classroom = ({ student, readingAttempts }) => {
  const [students, setStudents] = useState([]);
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [timeOnTaskData, setTimeOnTaskData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);
  const [readingAssessmentData, setReadingAssessmentData] = useState({});

  useEffect(() => {
    if (student && student.overallPerformance) {
      setOverallPerformanceData([
        {
          accuracy: student.overallPerformance.accuracy,
          fluency: student.overallPerformance.fluency,
        },
      ]);

      setTimeOnTaskData([
        { name: student.username, timeOnTask: student.overallPerformance.timeOnTask },
      ]);

      setStudents((prevStudents) => {
        const exists = prevStudents.some((s) => s.username === student.username);
        return exists ? prevStudents : [...prevStudents, student];
      });
    }

    if (student && student.misreadWords) {
      setMisreadData(student.misreadWords);
    }

    if (readingAttempts && readingAttempts.length > 0) {
      const assessmentData = calculateReadingAssessmentData(readingAttempts);
      setReadingAssessmentData(assessmentData);
    }
  }, [student, readingAttempts]);

  return (
    <div className="classroom">
      {/* Top Card: Progress Bar */}
      <div className="long-card">
        <Card className="long-card">
          <CardContent className="long-card-content">
            <Typography gutterBottom variant="h4" component="div">
              Progress Overview
            </Typography>
            <div className="progress-reading-container">
              <ReadingProgressBar performance={student?.overallPerformance} />
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
            <TimeOnTaskChart data={timeOnTaskData} />
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
