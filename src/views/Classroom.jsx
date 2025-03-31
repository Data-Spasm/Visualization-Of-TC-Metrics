import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import ComparativePerformanceChart from "../components/composed/ComparativeAnalysisChart";

import { assessAttempt } from "../utils/assessAttempt";
import "./Classroom.css";

const Classroom = ({ students, readingAttempts, misreadWords, assessments }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [miscueData, setMiscueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!students.length || !readingAttempts.length || !assessments.length) return;

    const cache = new Map();

    const getCachedResult = (content, raw) => {
      const key = `${content}|${raw}`;
      if (cache.has(key)) return cache.get(key);
      const result = assessAttempt(content, raw);
      cache.set(key, result);
      return result;
    };

    const compiled = assessments.flatMap((assessment, idx) => {
      const passageId = assessment._id?.$oid || assessment._id;
      const passageTitle = assessment.readingContent?.readingMaterial?.passageTitle || `Passage ${idx + 1}`;

      return students.map((student) => {
        const classAttempts = readingAttempts.filter((ra) => ra.readingAssessmentId === passageId);
        const studentAttempts = classAttempts.filter((ra) => ra.studentUsername === student.username);

        let numCorrect = 0, numDels = 0, numSubs = 0;
        studentAttempts.forEach((a) => a.readingAttempts?.forEach((seg) => {
          if (seg.attempted && seg.rawAttempt && seg.readingContent) {
            const result = getCachedResult(seg.readingContent, seg.rawAttempt);
            numCorrect += result.numCorrect || 0;
            numDels += result.numDels || 0;
            numSubs += result.numSubs || 0;
          }
        }));

        const totalClassCorrect = classAttempts.reduce((acc, a) => {
          a.readingAttempts?.forEach((seg) => {
            if (seg.attempted && seg.rawAttempt && seg.readingContent) {
              const result = getCachedResult(seg.readingContent, seg.rawAttempt);
              acc += result.numCorrect || 0;
            }
          });
          return acc;
        }, 0);

        return {
          passageId,
          passage: passageTitle,
          username: student.username,
          numCorrect,
          numDels,
          numSubs,
          studentAttempts: studentAttempts.length,
          classAttempts: classAttempts.length,
          avgCorrect: classAttempts.length ? totalClassCorrect / classAttempts.length : 0,
        };
      });
    });

    setMiscueData(compiled);
    setLoading(false);
  }, [students, readingAttempts, assessments]);

  if (loading) return <h2>Loading classroom data...</h2>;

  const isFullscreen = (key) => expandedCard === key;

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
          <Card className="card" onClick={() => setExpandedCard("accuracy")}> <CardContent><OverallAccuracyFluencyChart students={students} /></CardContent></Card>
          <Card className="card" onClick={() => setExpandedCard("engagement")}> <CardContent><ClassEngagementBubbleChart readingAttempts={readingAttempts} assessments={assessments} /></CardContent></Card>
          <Card className="card" onClick={() => setExpandedCard("tileview")}> <CardContent><ReadingAssessmentDataTileView readingAttempts={readingAttempts} assessments={assessments} students={students} /></CardContent></Card>
        </div>
      )}

      {expandedCard === "accuracy" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <OverallAccuracyFluencyChart students={students} />
        </div>
      )}

      {expandedCard === "engagement" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <ClassEngagementBubbleChart readingAttempts={readingAttempts} assessments={assessments} />
        </div>
      )}

      {expandedCard === "tileview" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <ReadingAssessmentDataTileView readingAttempts={readingAttempts} assessments={assessments} students={students} />
        </div>
      )}

      <div className="long-card-2">
        <Card className="long-card-2">
          <CardContent style={{ height: "100%", width: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Student vs Class Comparative Analysis
            </Typography>
            <ComparativePerformanceChart miscues={miscueData} students={students} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classroom;
