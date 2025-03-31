import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataTileView from "../components/tileSquareChart/ReadingAssessmentDataTileSquare";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import ComparativePerformanceChart from "../components/composed/ComparativeAnalysisChart";

import { DataContext } from "../context/DataContext";
import useAnalyticsEvent from "../hooks/useAnalyticsEvent";
import "./Classroom.css";

const Classroom = () => {
  const {
    students,
    readingAttempts,
    assessments,
    miscues,
    loading,
    attemptsLoaded,
    loadAttemptsAndMiscues,
  } = useContext(DataContext);

  const [expandedCard, setExpandedCard] = useState(null);
  const trackEvent = useAnalyticsEvent("Classroom Dashboard");
  const hoverStartRef = useRef({});

  useEffect(() => {
    if (!attemptsLoaded) {
      loadAttemptsAndMiscues();
    }
  }, [attemptsLoaded, loadAttemptsAndMiscues]);

  useEffect(() => {
    if (attemptsLoaded) {
      trackEvent("component_view", "Classroom Page Loaded");
    }
  }, [attemptsLoaded, trackEvent]);

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

  const miscueData = useMemo(() => {
    if (!students.length || !assessments.length || !attemptsLoaded) return [];

    return assessments.flatMap((assessment, idx) => {
      const passageId = assessment._id?.$oid || assessment._id;
      const passageTitle =
        assessment.readingContent?.readingMaterial?.passageTitle || `Passage ${idx + 1}`;

      return students.map((student) => {
        const key = `${student.username}_${passageId}`;
        const entries = miscues.byStudentPassage.get(key) || [];

        let numCorrect = 0,
          numDels = 0,
          numSubs = 0;

        entries.forEach((e) => {
          const result = e.result;
          numCorrect += result.numCorrect || 0;
          numDels += result.numDels || 0;
          numSubs += result.numSubs || 0;
        });

        const studentAttempts = entries.length;
        const classAttempts = readingAttempts.filter((a) => a.readingAssessmentId === passageId).length;

        const totalClassCorrect = readingAttempts.reduce((acc, a) => {
          if (a.readingAssessmentId === passageId) {
            a.readingAttempts?.forEach((seg) => {
              const matched = miscues.global.find(
                (m) =>
                  m.readingContent === seg.readingContent &&
                  m.rawAttempt === seg.rawAttempt
              );
              acc += matched?.result?.numCorrect || 0;
            });
          }
          return acc;
        }, 0);

        return {
          passageId,
          passage: passageTitle,
          username: student.username,
          numCorrect,
          numDels,
          numSubs,
          studentAttempts,
          classAttempts,
          avgCorrect: classAttempts > 0 ? totalClassCorrect / classAttempts : 0,
        };
      });
    });
  }, [students, readingAttempts, assessments, miscues, attemptsLoaded]);

  if (loading) return <h2>Loading classroom data...</h2>;
  if (!attemptsLoaded) return <h2>Loading reading attempts...</h2>;

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
          <Card
            className="card"
            onMouseEnter={() => handleMouseEnter("Overall Accuracy & Fluency")}
            onMouseLeave={() => handleMouseLeave("Overall Accuracy & Fluency")}
            onClick={() => {
              trackEvent("card_click", "Overall Accuracy & Fluency");
              setExpandedCard("accuracy");
            }}
          >
            <CardContent>
              <OverallAccuracyFluencyChart students={students} />
            </CardContent>
          </Card>

          <Card
            className="card"
            onMouseEnter={() => handleMouseEnter("Class Engagement")}
            onMouseLeave={() => handleMouseLeave("Class Engagement")}
            onClick={() => {
              trackEvent("card_click", "Class Engagement Bubble Chart");
              setExpandedCard("engagement");
            }}
          >
            <CardContent>
              <ClassEngagementBubbleChart readingAttempts={readingAttempts} assessments={assessments} />
            </CardContent>
          </Card>

          <Card
            className="card"
            onMouseEnter={() => handleMouseEnter("Assessment Tile View")}
            onMouseLeave={() => handleMouseLeave("Assessment Tile View")}
            onClick={() => {
              trackEvent("card_click", "Assessment Data Tile View");
              setExpandedCard("tileview");
            }}
          >
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

      {expandedCard === "accuracy" && (
        <div className="fullscreen-card">
          <button
            className="close-btn"
            onClick={() => {
              trackEvent("fullscreen_close", "Overall Accuracy & Fluency");
              setExpandedCard(null);
            }}
          >
            ✖
          </button>
          <OverallAccuracyFluencyChart students={students} />
        </div>
      )}

      {expandedCard === "engagement" && (
        <div className="fullscreen-card">
          <button
            className="close-btn"
            onClick={() => {
              trackEvent("fullscreen_close", "Class Engagement Bubble Chart");
              setExpandedCard(null);
            }}
          >
            ✖
          </button>
          <ClassEngagementBubbleChart
            readingAttempts={readingAttempts}
            assessments={assessments}
          />
        </div>
      )}

      {expandedCard === "tileview" && (
        <div className="fullscreen-card">
          <button
            className="close-btn"
            onClick={() => {
              trackEvent("fullscreen_close", "Assessment Data Tile View");
              setExpandedCard(null);
            }}
          >
            ✖
          </button>
          <ReadingAssessmentDataTileView
            readingAttempts={readingAttempts}
            assessments={assessments}
            students={students}
          />
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
