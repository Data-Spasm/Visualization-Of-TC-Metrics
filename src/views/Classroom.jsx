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
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    console.log("Fetching classroom data...");
    try {
      console.log("Fetched Students:", students);
      students.forEach((student, i) => {
        console.log(`Student ${i + 1}:`, student.username, student.student?.reading?.overallPerformance);
      });

      console.log("Fetched Reading Attempts:", readingAttempts);
      console.log("Fetched Misread Words:", misreadWords);
      console.log("Fetched Assessments:", assessments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [students, readingAttempts, misreadWords, assessments]);

  if (loading) return <h2>Loading classroom data...</h2>;
  if (!students?.length) return <h2>No students found.</h2>;
  if (!readingAttempts?.length) return <h2>No reading attempts found.</h2>;
  if (!assessments?.length) return <h2>No reading assessments found.</h2>;

  return (
    <div className="classroom">
      {!expandedCard && (
        <div className="long-card">
          <Card className="long-card">
            <CardContent className="long-card-content">
              <Typography gutterBottom variant="h4">
                Classroom Progress Overview
              </Typography>
              <div className="progress-reading-container">
                <ReadingProgressBar readingAttempts={readingAttempts} students={students} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!expandedCard && (
        <div className="grid-container">
          <Card className="card" onClick={() => setExpandedCard("accuracy")}>
            <CardContent>
              <OverallAccuracyFluencyChart students={students} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("engagement")}>
            <CardContent>
              <ClassEngagementBubbleChart readingAttempts={readingAttempts} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("distribution")}>
            <CardContent>
              <WordAccuracyDistributionChart students={students} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("tileview")}>
            <CardContent>
              <ReadingAssessmentDataTileView readingAttempts={readingAttempts} assessments={assessments} students={students} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("performance")}>
            <CardContent>
              <ClassWideReadingPerformance students={students} />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "accuracy" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>

          <div className="long-card">
            <Card className="long-card">
              <CardContent className="long-card-content">
                <Typography gutterBottom variant="h4">
                  Classroom Progress Overview
                </Typography>
                <div className="overview-flex-container">
                  <div className="overview-progress">
                    <ReadingProgressBar readingAttempts={readingAttempts} students={students} />
                  </div>
                  <div className="overview-performance">
                    <ClassWideReadingPerformance students={students} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card">
            <CardContent>
              <OverallAccuracyFluencyChart students={students} />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "engagement" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <ClassEngagementBubbleChart readingAttempts={readingAttempts} assessments={assessments} />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "distribution" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <WordAccuracyDistributionChart students={students} />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "tileview" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <ReadingAssessmentDataTileView readingAttempts={readingAttempts} assessments={assessments} students={students} />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "performance" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <ClassWideReadingPerformance students={students} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Classroom;
