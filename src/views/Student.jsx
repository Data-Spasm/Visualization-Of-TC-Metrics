import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ReadingProgressBarCard from "../components/progressbar/ReadingProgressBarStudent";
import StudentEngagementBubbleChart from "../components/bubblecharts/StudentEngagementBubbleChart";
import WordAccuracyStudent from "../components/barcharts/WordAccuracyStudent";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ComparativePerformanceChart from "../components/composed/ComparativeAnalysisChart";

import { assessAttempt } from "../utils/assessAttempt";
import "../components/textbase/ClassWideReadingPerformance.css";
import "./Classroom.css";

const Student = ({ student, allAssessmentAttempts, assessments }) => {
  const [miscueData, setMiscueData] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!student || !assessments.length || !allAssessmentAttempts.length) return;

    const compiledData = assessments.map((assessment, idx) => {
      const passageId = assessment._id?.$oid || assessment._id;
      const passageTitle = assessment.readingContent?.readingMaterial?.passageTitle || `Passage ${idx + 1}`;

      const classAttempts = allAssessmentAttempts.filter(
        (attempt) => attempt.readingAssessmentId === passageId
      );

      const studentAttempts = classAttempts.filter(
        (attempt) => attempt.studentUsername === student.username
      );

      let numCorrect = 0;
      let numDels = 0;
      let numSubs = 0;
      let numIns = 0;
      let numReps = 0;

      studentAttempts.forEach((attempt) => {
        attempt.readingAttempts?.forEach((seg) => {
          if (seg.attempted && seg.rawAttempt && seg.readingContent) {
            const result = assessAttempt(seg.readingContent, seg.rawAttempt);
            numCorrect += result.numCorrect || 0;
            numDels += result.numDels || 0;
            numSubs += result.numSubs || 0;
            numIns += result.numIns || 0;
            numReps += result.numReps || 0;
          }
        });
      });

      const totalWords = numCorrect + numDels + numSubs + numIns + numReps;
      const miscueRate =
        totalWords > 0 ? ((numDels + numSubs + numIns + numReps) / totalWords) * 100 : 0;

      return {
        passageId,
        passageTitle,
        numCorrect,
        numDels,
        numSubs,
        numIns,
        numReps,
        studentAttempts: studentAttempts.length,
        classAttempts: classAttempts.length,
        miscueRate: +miscueRate.toFixed(2),
      };
    });

    setMiscueData(compiledData);
  }, [student, allAssessmentAttempts, assessments]);

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
                readingAttempts={allAssessmentAttempts}
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
                readingAttempts={allAssessmentAttempts}
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
                readingAttempts={allAssessmentAttempts}
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
                readingAttempts={allAssessmentAttempts}
                assessments={assessments}
                studentUsername={student.username}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="long-card-2">
        <Card className="long-card-2">
          <CardContent style={{ height: "100%", width: "100%" }}>
            <ComparativePerformanceChart miscues={miscueData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Student;
