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
  const [fullscreenCard, setFullscreenCard] = useState(null);
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

      studentAttempts.forEach((attempt) => {
        attempt.readingAttempts?.forEach((seg) => {
          if (seg.attempted && seg.rawAttempt && seg.readingContent) {
            const result = assessAttempt(seg.readingContent, seg.rawAttempt);
            numCorrect += result.numCorrect || 0;
            numDels += result.numDels || 0;
            numSubs += result.numSubs || 0;
          }
        });
      });

      const totalWords = numCorrect + numDels + numSubs;
      const miscueRate = totalWords > 0 ? ((numDels + numSubs) / totalWords) * 100 : 0;

      return {
        passageId,
        passage: passageTitle,
        numCorrect,
        numDels,
        numSubs,
        studentAttempts: studentAttempts.length,
        classAttempts: classAttempts.length,
        miscueRate: +miscueRate.toFixed(2),
      };
    });

    setMiscueData(compiledData);
  }, [student, allAssessmentAttempts, assessments]);

  const isFullscreen = (key) => fullscreenCard === key;

  return (
    <div className="classroom">
      <div className="long-card">
        <Card className="long-card">
          <CardContent className="long-card-content">
            <Typography gutterBottom variant="h4" component="div">
              Progress Overview for {student.firstName} {student.lastName}
            </Typography>
            <div className="progress-reading-container">
              <ReadingProgressBarCard
                miscues={miscueData}
                studentUsername={student.username}
                onBarClick={(passageId) =>
                  navigate(`/passages/${student.username}/${passageId}`)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid-container">
        {isFullscreen("engagement") || !fullscreenCard ? (
          <Card
            className={isFullscreen("engagement") ? "fullscreen-card" : "card"}
            onClick={() => setFullscreenCard("engagement")}
          >
            <CardContent>
              {isFullscreen("engagement") && (
                <button
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenCard(null);
                  }}
                >
                  ✖
                </button>
              )}
              <StudentEngagementBubbleChart student={student} />
            </CardContent>
          </Card>
        ) : null}

        {isFullscreen("wordAccuracy") || !fullscreenCard ? (
          <Card
            className={isFullscreen("wordAccuracy") ? "fullscreen-card" : "card"}
            onClick={() => setFullscreenCard("wordAccuracy")}
          >
            <CardContent>
              {isFullscreen("wordAccuracy") && (
                <button
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenCard(null);
                  }}
                >
                  ✖
                </button>
              )}
              <WordAccuracyStudent student={student} miscues={miscueData} />
            </CardContent>
          </Card>
        ) : null}

        {isFullscreen("tileView") || !fullscreenCard ? (
          <Card
            className={isFullscreen("tileView") ? "fullscreen-card" : "card"}
            onClick={() => setFullscreenCard("tileView")}
          >
            <CardContent>
              {isFullscreen("tileView") && (
                <button
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenCard(null);
                  }}
                >
                  ✖
                </button>
              )}
              <ReadingAssessmentDataTileView
                readingAttempts={allAssessmentAttempts}
                assessments={assessments}
                studentUsername={student.username}
              />
            </CardContent>
          </Card>
        ) : null}
      </div>

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
