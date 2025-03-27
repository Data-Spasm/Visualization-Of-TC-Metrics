import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import StudentEngagementBubbleChart from "../components/bubblecharts/StudentEngagementBubbleChart";
import ReadingProgressBarCard from "../components/progressbar/ReadingProgressBarStudent";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ReadingAssessmentDataLineGraph from "../components/linegraphs/ReadingAssessmentDataLineGraph";
import WordAccuracyDistributionChart from "../components/barcharts/WordAccuracyDistributionChart";
import StudentWideReadingPerformance from "../components/textbase/StudentWideReadingPerformance";
import "../components/textbase/ClassWideReadingPerformance.css";
import "./Classroom.css";

// Google Analytics Event Tracking Function for Clicks & Hovers
const trackEvent = (eventName, eventLabel, eventType = "click") => {
  if (window.gtag) {
    window.gtag("event", eventType, {
      event_category: "User Interaction",
      event_label: eventLabel,
    });
  }
};

const Student = ({ student }) => {
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);

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
    }
  }, [student]);

  return (
    <div className="classroom">
      {/* Top Card: Progress Bar */}
      <div className="long-card">
        <Card
          className="long-card"
          onClick={() => trackEvent("click_progress_overview", "User clicked on Progress Overview Card")}
          onMouseEnter={() => trackEvent("hover_progress_overview", "User hovered over Progress Overview Card", "hover")}
        >
          <CardContent className="long-card-content">
            <Typography gutterBottom variant="h4" component="div">
              Progress Overview
            </Typography>
            <div className="progress-reading-container">
              <ReadingProgressBarCard student={student} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid-container">
        <Card
          className="card"
          onClick={() => trackEvent("click_accuracy_fluency", "User clicked on Overall Accuracy & Fluency Chart")}
          onMouseEnter={() => trackEvent("hover_accuracy_fluency", "User hovered over Overall Accuracy & Fluency Chart", "hover")}
        >
          <CardContent>
            <OverallAccuracyFluencyChart data={overallPerformanceData} />
          </CardContent>
        </Card>

        <Card
          className="card"
          onClick={() => trackEvent("click_student_engagement", "User clicked on Student Engagement Bubble Chart")}
          onMouseEnter={() => trackEvent("hover_student_engagement", "User hovered over Student Engagement Bubble Chart", "hover")}
        >
          <CardContent>
            <StudentEngagementBubbleChart student={student} />
          </CardContent>
        </Card>

        <Card
          className="card"
          onClick={() => trackEvent("click_word_accuracy_distribution", "User clicked on Word Accuracy Distribution Chart")}
          onMouseEnter={() => trackEvent("hover_word_accuracy_distribution", "User hovered over Word Accuracy Distribution Chart", "hover")}
        >
          <CardContent>
            <WordAccuracyDistributionChart student={student} />
          </CardContent>
        </Card>

        <Card
          className="card"
          onClick={() => trackEvent("click_misread_words", "User clicked on Top Misread Words Chart")}
          onMouseEnter={() => trackEvent("hover_misread_words", "User hovered over Top Misread Words Chart", "hover")}
        >
          <CardContent>
            <TopMisreadWordsChart data={misreadData} />
          </CardContent>
        </Card>

        <Card
          className="card"
          onClick={() => trackEvent("click_reading_assessment", "User clicked on Reading Assessment Line Graph")}
          onMouseEnter={() => trackEvent("hover_reading_assessment", "User hovered over Reading Assessment Line Graph", "hover")}
        >
          <CardContent>
            <ReadingAssessmentDataLineGraph student={student} />
          </CardContent>
        </Card>

        <Card
          className="card"
          onClick={() => trackEvent("click_student_summary", "User clicked on Student Performance Summary")}
          onMouseEnter={() => trackEvent("hover_student_summary", "User hovered over Student Performance Summary", "hover")}
        >
          <CardContent>
            <StudentWideReadingPerformance student={student} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Student;
