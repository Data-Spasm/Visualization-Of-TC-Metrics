import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StudentEngagementBubbleChart from "../components/bubblecharts/StudentEngagementBubbleChart";
import ReadingProgressBarCard from "../components/progressbar/ReadingProgressBarStudent";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import WordAccuracyStudent from "../components/barcharts/WordAccuracyStudent";
import { assessAttempt } from "../utils/assessAttempt";
import "../components/textbase/ClassWideReadingPerformance.css";
import "./Classroom.css"; // keep CSS shared for now

const Student = ({ student, allAssessmentAttempts, assessments }) => {
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);
  const [miscueData, setMiscueData] = useState([]);
  const [fullscreenCard, setFullscreenCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (student) {
      const perf = student.student?.reading?.overallPerformance;
      if (perf) {
        setOverallPerformanceData([
          {
            accuracy: perf.overallAccuracy,
            fluency: perf.overallFluency,
          },
        ]);
      }

      if (student.student?.reading?.misreadWords) {
        setMisreadData(student.student.reading.misreadWords);
      }

      const assessmentIds = student.student?.reading?.readingAssessmentAttemptIds || [];
      const matchedAssessments = allAssessmentAttempts.filter(attempt =>
        assessmentIds.includes(attempt._id?.$oid)
      );

      const miscues = matchedAssessments.map((assessment, idx) => {
        const passageId = assessment.readingAssessmentId;
        const matchedAssessmentDoc = assessments.find(
          a => a._id?.$oid === passageId || a._id === passageId
        );
        const passageTitle =
          matchedAssessmentDoc?.readingContent?.readingMaterial?.passageTitle ||
          `Passage ${idx + 1}`;

        const combinedResult = {
          passageId,
          passageTitle,
          numDels: 0,
          numIns: 0,
          numReps: 0,
          numSubs: 0,
          numCorrect: 0,
        };

        assessment.readingAttempts.forEach((attempt) => {
          if (attempt.attempted && attempt.rawAttempt && attempt.readingContent) {
            const result = assessAttempt(attempt.readingContent, attempt.rawAttempt);
            combinedResult.numDels += result.numDels || 0;
            combinedResult.numIns += result.numIns || 0;
            combinedResult.numReps += result.numReps || 0;
            combinedResult.numSubs += result.numSubs || 0;
            combinedResult.numCorrect += result.numCorrect || 0;
          }
        });

        return combinedResult;
      });

      setMiscueData(miscues);
    }
  }, [student, allAssessmentAttempts, assessments]);

  const isFullscreen = (key) => fullscreenCard === key;

  return (
    <div className="classroom">
      <div className="long-card">
        <Card className="long-card">
          <CardContent className="long-card-content">
            <Typography gutterBottom variant="h4" component="div">
              Progress Overview
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
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); setFullscreenCard(null); }}>
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
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); setFullscreenCard(null); }}>
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
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); setFullscreenCard(null); }}>
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
    </div>
  );
};

export default Student;
