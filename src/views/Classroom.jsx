import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import TimeOnTaskChart from "../components/barcharts/TimeOnTaskChart";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import WordAccuracyDistributionChart from "../components/barcharts/WordAccuracyDistributionChart";
import "./Classroom.css";

const Classroom = ({ students, readingAttempts, misreadWords, assessments }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching classroom data...");

    try {
      console.log("Fetched Students:", students);
      console.log("Fetched Reading Attempts:", readingAttempts);
      console.log("Fetched Misread Words:", misreadWords);
      console.log("Fetched Assessments:", assessments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  }, [students, readingAttempts, misreadWords, assessments]);

  if (loading) {
    return <h2>Loading classroom data...</h2>;
  }

  if (!students || students.length === 0) {
    return <h2>No students found.</h2>;
  }

  if (!readingAttempts || readingAttempts.length === 0) {
    return <h2>No reading attempts found.</h2>;
  }

  if (!assessments || assessments.length === 0) {
    return <h2>No reading assessments found.</h2>;
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
              <ReadingProgressBar />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid-container">
        <Card className="card">
          <CardContent>
            {/* <OverallAccuracyFluencyChart /> */}
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
            <TopMisreadWordsChart data={misreadWords} />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <ReadingAssessmentDataTileView
              readingAttempts={readingAttempts}
              assessments={assessments}
              students={students}
            />
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