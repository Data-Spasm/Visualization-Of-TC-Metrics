import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import "./Classroom.css";

const Classroom = ({ student }) => {
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);

  useEffect(() => {
    if (student && student.overallPerformance) {
      const performanceData = {
        accuracy: student.overallPerformance.accuracy,
        fluency: student.overallPerformance.fluency,
      };
      setOverallPerformanceData(performanceData);
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
            <Typography gutterBottom variant="h6" component="div">
              Visualization 2
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Visualization 3
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Data visualization content goes here.
            </Typography>
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
