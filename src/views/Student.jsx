import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ReadingProgressBarCard from "../components/progressbar/ReadingProgressBarStudent";
import StudentEngagementBubbleChart from "../components/bubblecharts/StudentEngagementBubbleChart";
import WordAccuracyStudent from "../components/barcharts/WordAccuracyStudent";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ComparativePerformanceChart from "../components/composed/ComparativeAnalysisChart";

import { DataContext } from "../context/DataContext";
import useAnalyticsEvent from "../hooks/useAnalyticsEvent";
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
  const trackEvent = useAnalyticsEvent("Student Dashboard");
  const hoverStartRef = useRef({});
  const classroomRef = useRef(null);

  useEffect(() => {
    if (!attemptsLoaded) loadAttemptsAndMiscues();
  }, [attemptsLoaded, loadAttemptsAndMiscues]);

  useEffect(() => {
    if (attemptsLoaded) {
      trackEvent("component_view", `Student Dashboard: ${student.username}`);
    }
  }, [attemptsLoaded, trackEvent, student.username]);

  const handleMouseEnter = (label) => {
    hoverStartRef.current[label] = Date.now();
    trackEvent("hover_start", label);
  };

  const handleMouseLeave = (label) => {
    const start = hoverStartRef.current[label];
    if (start) {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEvent("hover_end", label, duration);
      delete hoverStartRef.current[label];
    }
  };

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

  return (
    <div className="classroom" ref={classroomRef}>
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
          <Card
            className="card"
            onClick={() => {
              trackEvent("card_click", "Student Engagement Bubble Chart");
              setExpandedCard("engagement");
            }}
            onMouseEnter={() => handleMouseEnter("Student Engagement Bubble Chart")}
            onMouseLeave={() => handleMouseLeave("Student Engagement Bubble Chart")}
          >
            <CardContent>
              <StudentEngagementBubbleChart
                student={student}
                readingAttempts={studentAttempts}
                assessments={assessments}
              />
            </CardContent>
          </Card>

          <Card
            className="card"
            onClick={() => {
              trackEvent("card_click", "Word Accuracy Chart");
              setExpandedCard("wordAccuracy");
            }}
            onMouseEnter={() => handleMouseEnter("Word Accuracy Chart")}
            onMouseLeave={() => handleMouseLeave("Word Accuracy Chart")}
          >
            <CardContent>
              <WordAccuracyStudent student={student} miscues={miscueData} />
            </CardContent>
          </Card>

          <Card
            className="card"
            onClick={() => {
              trackEvent("card_click", "Reading Assessment Tile View");
              setExpandedCard("tiles");
            }}
            onMouseEnter={() => handleMouseEnter("Reading Assessment Tile View")}
            onMouseLeave={() => handleMouseLeave("Reading Assessment Tile View")}
          >
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

      {expandedCard && (
        <div className="expanded-card-overlay">
          <div className="expanded-card">
            <button
              className="close-btn"
              onClick={() => {
                trackEvent("fullscreen_close", expandedCard);
                setExpandedCard(null);
              }}
            >
              ✖
            </button>
            {expandedCard === "engagement" && (
              <StudentEngagementBubbleChart
                student={student}
                readingAttempts={studentAttempts}
                assessments={assessments}
              />
            )}
            {expandedCard === "wordAccuracy" && (
              <WordAccuracyStudent student={student} miscues={miscueData} />
            )}
            {expandedCard === "tiles" && (
              <ReadingAssessmentDataTileView
                readingAttempts={studentAttempts}
                assessments={assessments}
                studentUsername={student.username}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;