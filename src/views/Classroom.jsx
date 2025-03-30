import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import WordAccuracyDistributionChart from "../components/barcharts/WordAccuracyDistributionChart";

import "./Classroom.css";

const Classroom = ({ students, readingAttempts, misreadWords, assessments }) => {
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, [students, readingAttempts, misreadWords, assessments]);

  if (loading) return <h2>Loading classroom data...</h2>;
  if (!students?.length) return <h2>No students found.</h2>;
  if (!readingAttempts?.length) return <h2>No reading attempts found.</h2>;
  if (!assessments?.length) return <h2>No reading assessments found.</h2>;

  const renderExpandedCard = (title, Component, props = {}) => (
    <div className="fullscreen-card">
      <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
      <Card className="card">
        <CardContent>
          <Typography variant="h5" gutterBottom>{title}</Typography>
          <Component {...props} />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="classroom">
      {!expandedCard && (
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
              <ClassEngagementBubbleChart readingAttempts={readingAttempts} assessments={assessments} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("distribution")}>
            <CardContent>
              <WordAccuracyDistributionChart students={students} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("tileview")}>
            <CardContent>
              <ReadingAssessmentDataTileView
                readingAttempts={readingAttempts}
                assessments={assessments}
                students={students}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "accuracy" &&
        renderExpandedCard("Overall Accuracy & Fluency", OverallAccuracyFluencyChart, { students })}

      {expandedCard === "engagement" &&
        renderExpandedCard("Class Engagement with Passages", ClassEngagementBubbleChart, {
          readingAttempts,
          assessments,
        })}

      {expandedCard === "distribution" &&
        renderExpandedCard("Word Accuracy Distribution", WordAccuracyDistributionChart, { students })}

      {expandedCard === "tileview" &&
        renderExpandedCard("Reading Assessment Completion", ReadingAssessmentDataTileView, {
          readingAttempts,
          assessments,
          students,
        })}

      {expandedCard === "performance" &&
        renderExpandedCard("Class-Wide Reading Performance", ClassWideReadingPerformance, { students })}
    </div>
  );
};

export default Classroom;
