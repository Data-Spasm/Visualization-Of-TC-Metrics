import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import TimeOnTaskChart from "../components/barcharts/TimeOnTaskChart";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import "./Classroom.css";

const Classroom = ({ student }) => {
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [timeOnTaskData, setTimeOnTaskData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered");
    console.log("Student data:", student);

    if (student && student.overallPerformance) {
      console.log("Processing overall performance data");
      setOverallPerformanceData([{
        accuracy: student.overallPerformance.accuracy,
        fluency: student.overallPerformance.fluency,
      }]);

      setTimeOnTaskData([{ name: student.username, timeOnTask: student.overallPerformance.timeOnTask }]);
    }

    if (student && student.misreadWords) {
      console.log("Misread words:", student.misreadWords);
      setMisreadData(student.misreadWords);
    } else {
      console.log("No misread words found");
    }
  }, [student]);

  return (
    <div className="classroom">
      {/* Top Grid with 3 Visualization Cards */}
      <div className="grid-container">

        <Card className="card">
          <CardContent>
            <OverallAccuracyFluencyChart data={overallPerformanceData} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
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

      </div>

      {/* Bottom Card: Progress Bar on Left, Reading Attempts on Right */}
      <Card className="long-card">
        <CardContent className="long-card-content">
          <Typography gutterBottom variant="h6" component="div">
            Progress Overview
          </Typography>
          <div className="progress-reading-container">
            {/* Left Side: Progress Bar */}
            <ReadingProgressBar performance={student?.overallPerformance} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classroom;