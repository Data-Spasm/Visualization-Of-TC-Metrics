import React, { useContext, useEffect, useMemo, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ReadingProgressBarCard from "../components/progressbar/ReadingProgressBarStudent";
import StudentEngagementBubbleChart from "../components/bubblecharts/StudentEngagementBubbleChart";
import WordAccuracyStudent from "../components/barcharts/WordAccuracyStudent";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ComparativePerformanceChart from "../components/composed/ComparativeAnalysisChart";

import { DataContext } from "../context/DataContext";
import "../components/textbase/ClassWideReadingPerformance.css";
import "./Classroom.css";

const Student = ({ student }) => {
  const {
    assessments,
    readingAttempts,
    miscues,
    attemptsLoaded,
    loadAttemptsAndMiscues,
  } = useContext(DataContext);

  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  // Trigger async load if not already loaded
  useEffect(() => {
    if (!attemptsLoaded) loadAttemptsAndMiscues();
  }, [attemptsLoaded, loadAttemptsAndMiscues]);

  const studentAttempts = useMemo(() => {
    return readingAttempts.filter((a) => a.studentUsername === student.username);
  }, [readingAttempts, student.username]);

  const miscueData = useMemo(() => {
    if (!assessments.length || !student || !attemptsLoaded) return [];

    return assessments.map((assessment, idx) => {
      const passageId = assessment._id?.$oid || assessment._id;
      const passageTitle =
        assessment.readingContent?.readingMaterial?.passageTitle || `Passage ${idx + 1}`;
      const key = `${student.username}_${passageId}`;
      const entries = miscues.byStudentPassage.get(key) || [];

      let numCorrect = 0,
        numDels = 0,
        numSubs = 0,
        numIns = 0,
        numReps = 0,
        numRevs = 0;

      entries.forEach((e) => {
        const r = e.result;
        numCorrect += r.numCorrect || 0;
        numDels += r.numDels || 0;
        numSubs += r.numSubs || 0;
        numIns += r.numIns || 0;
        numReps += r.numReps || 0;
        numRevs += r.numRevs || 0;
      });

      const totalWords = numCorrect + numDels + numSubs + numIns + numReps + numRevs;
      const miscueRate =
        totalWords > 0
          ? ((numDels + numSubs + numIns + numReps + numRevs) / totalWords) * 100
          : 0;

      return {
        passageId,
        passageTitle,
        numCorrect,
        numDels,
        numSubs,
        numIns,
        numReps,
        numRevs,
        studentAttempts: entries.length,
        classAttempts: readingAttempts.filter(
          (a) => a.readingAssessmentId === passageId
        ).length,
        miscueRate: +miscueRate.toFixed(2),
      };
    });
  }, [assessments, miscues, student, readingAttempts, attemptsLoaded]);

  if (!attemptsLoaded) return <h2>Loading student data...</h2>;

  const isFullscreen = (key) => expandedCard === key;

  return (
    <div className="classroom">
      {!expandedCard && (
        <div className="long-card">
          <Card className="long-card">
            <CardContent className="long-card-content">
              <Typography gutterBottom variant="h4">
                Progress Overview for {student.firstName} {student.lastName}
              </Typography>
              <div className="progress-reading-container">
                <ReadingProgressBarCard
                  miscues={miscueData}
                  studentUsername={student.username}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!expandedCard && (
        <div className="grid-container">
          <Card className="card" onClick={() => setExpandedCard("engagement")}>
            <CardContent>
              <StudentEngagementBubbleChart
                student={student}
                readingAttempts={studentAttempts}
                assessments={assessments}
              />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("wordAccuracy")}>
            <CardContent>
              <WordAccuracyStudent student={student} miscues={miscueData} />
            </CardContent>
          </Card>

          <Card className="card" onClick={() => setExpandedCard("tiles")}>
            <CardContent>
              <ReadingAssessmentDataTileView
                readingAttempts={studentAttempts}
                assessments={assessments}
                studentUsername={student.username}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "engagement" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <StudentEngagementBubbleChart
                student={student}
                readingAttempts={studentAttempts}
                assessments={assessments}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "wordAccuracy" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <WordAccuracyStudent student={student} miscues={miscueData} />
            </CardContent>
          </Card>
        </div>
      )}

      {expandedCard === "tiles" && (
        <div className="fullscreen-card">
          <button className="close-btn" onClick={() => setExpandedCard(null)}>✖</button>
          <Card className="card">
            <CardContent>
              <ReadingAssessmentDataTileView
                readingAttempts={studentAttempts}
                assessments={assessments}
                studentUsername={student.username}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Student;
