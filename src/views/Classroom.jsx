import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ReadingProgressBar from "../components/progressbar/ReadingProgressBar";
import TimeOnTaskChart from "../components/barcharts/TimeOnTaskChart";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ClassWideReadingPerformance from "../components/textbase/ClassWideReadingPerformance";
import ReadingAssessmentDataLineGraph from "../components/linegraphs/ReadingAssessmentDataLineGraph";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart";
import WordAccuracyDistributionChart from "../components/barcharts/WordAccuracyDistributionChart";
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

const Classroom = ({ student, readingAttempts }) => {
  const [students, setStudents] = useState([]);
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [timeOnTaskData, setTimeOnTaskData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);
  const [readingAssessmentData, setReadingAssessmentData] = useState({});

  useEffect(() => {
    if (student && student.overallPerformance) {
      setOverallPerformanceData([
        {
          accuracy: student.overallPerformance.accuracy,
          fluency: student.overallPerformance.fluency,
        },
      ]);

      setTimeOnTaskData([
        { name: student.username, timeOnTask: student.overallPerformance.timeOnTask },
      ]);

      setStudents((prevStudents) => {
        const exists = prevStudents.some((s) => s.username === student.username);
        return exists ? prevStudents : [...prevStudents, student];
      });
    }

    if (student && student.misreadWords) {
      setMisreadData(student.misreadWords);
    }

    if (readingAttempts && readingAttempts.length > 0) {
      const assessmentData = calculateReadingAssessmentData(readingAttempts);
      setReadingAssessmentData(assessmentData);
    }
  }, [student, readingAttempts]);

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
              <ReadingProgressBar performance={student?.overallPerformance} />
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
          onClick={() => trackEvent("click_class_engagement", "User clicked on Class Engagement Bubble Chart")}
          onMouseEnter={() => trackEvent("hover_class_engagement", "User hovered over Class Engagement Bubble Chart", "hover")}
        >
          <CardContent>
            <ClassEngagementBubbleChart readingAttempts={readingAttempts} />
          </CardContent>
        </Card>

        <Card 
          className="card"
          onClick={() => trackEvent("click_word_accuracy_distribution", "User clicked on Word Accuracy Distribution Chart")}
          onMouseEnter={() => trackEvent("hover_word_accuracy_distribution", "User hovered over Word Accuracy Distribution Chart", "hover")}
        >
          <CardContent>
            <WordAccuracyDistributionChart students={students} />
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
            <ReadingAssessmentDataLineGraph data={[readingAssessmentData]} />
          </CardContent>
        </Card>

        <Card 
          className="card"
          onClick={() => trackEvent("click_class_wide_performance", "User clicked on Class-Wide Reading Performance")}
          onMouseEnter={() => trackEvent("hover_class_wide_performance", "User hovered over Class-Wide Reading Performance", "hover")}
        >
          <CardContent>
            <ClassWideReadingPerformance students={students} />
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default Classroom;