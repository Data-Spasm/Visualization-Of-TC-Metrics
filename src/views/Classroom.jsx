import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import TimeOnTaskChart from "../components/barcharts/TimeOnTaskChart";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import "./Classroom.css";

const Classroom = ({ student }) => {
  const [students, setStudents] = useState([]); // Added students state
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

      // Update students state to include the current student (if not already present)
      setStudents((prevStudents) => {
        const exists = prevStudents.some((s) => s.username === student.username);
        return exists ? prevStudents : [...prevStudents, student];
      });
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


        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Visualization 4
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>

        {/* Class Wide Reading Performance Card */}
        <Card className="card">
          <CardContent>
            <ClassWideReadingPerformance students={students} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Card: Progress Bar */}
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