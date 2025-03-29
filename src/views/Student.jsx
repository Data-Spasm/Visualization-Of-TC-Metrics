import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import OverallAccuracyFluencyChart from "../components/linegraphs/OverallAccuracyFluencyChart";
import ClassEngagementBubbleChart from "../components/bubblecharts/ClassEngagementBubbleChart"; // Correct import
import ReadingProgressBarCard from "../components/progressbar/ReadingProgressBarStudent";
import TopMisreadWordsChart from "../components/barcharts/TopMisreadWordsChart";
import ReadingAssessmentDataLineGraph from "../components/linegraphs/ReadingAssessmentDataLineGraph";
import WordAccuracyDistributionChart from "../components/barcharts/WordAccuracyDistributionChart";
import StudentWideReadingPerformance from "../components/textbase/StudentWideReadingPerformance";
import WordAccuracyStudent from "../components/barcharts/WordAccuracyStudent";
import { assessAttempt } from "../utils/assessAttempt";
import "../components/textbase/ClassWideReadingPerformance.css";
import "./Classroom.css";

const trackEvent = (eventName, eventLabel, eventType = "click") => {
  if (window.gtag) {
    window.gtag("event", eventType, {
      event_category: "User Interaction",
      event_label: eventLabel,
    });
  }
};

const Student = ({ student, allAssessmentAttempts, assessments }) => {
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);
  const [misreadData, setMisreadData] = useState([]);
  const [miscueData, setMiscueData] = useState([]);

  useEffect(() => {
    console.log("Student object received:", student);

    if (student) {
      const perf = student.student?.reading?.overallPerformance;
      if (perf) {
        console.log("Found overall performance:", perf);
        setOverallPerformanceData([
          {
            accuracy: perf.overallAccuracy,
            fluency: perf.overallFluency,
          },
        ]);
      }

      if (student.student?.reading?.misreadWords) {
        console.log("Found misread words:", student.student.reading.misreadWords);
        setMisreadData(student.student.reading.misreadWords);
      }

      const assessmentIds = student.student?.reading?.readingAssessmentAttemptIds || [];
      console.log("Reading attempt IDs:", assessmentIds);

      const matchedAssessments = allAssessmentAttempts.filter(attempt =>
        assessmentIds.includes(attempt._id?.$oid)
      );

      console.log("Matched assessment attempts:", matchedAssessments);

      const miscues = matchedAssessments.map((assessment, idx) => {
        const passageId = assessment.readingAssessmentId;

        // Get the matching assessment from the full list (to get the passage title)
        const matchedAssessmentDoc = assessments.find(a =>
          a._id?.$oid === passageId || a._id === passageId
        );

        const passageTitle = matchedAssessmentDoc?.readingContent?.readingMaterial?.passageTitle || `Passage ${idx + 1}`;

        const combinedResult = {
          passageTitle,
          numDels: 0,
          numIns: 0,
          numReps: 0,
          numSelfs: 0,
          numCorrect: 0,
        };

        assessment.readingAttempts.forEach((attempt, index) => {
          if (attempt.attempted && attempt.rawAttempt && attempt.readingContent) {
            const result = assessAttempt(attempt.readingContent, attempt.rawAttempt);

            combinedResult.numDels += result.numDels || 0;
            combinedResult.numIns += result.numIns || 0;
            combinedResult.numReps += result.numReps || 0;
            combinedResult.numSelfs += result.numSelfs || 0;
            combinedResult.numCorrect += result.numCorrect || 0;

            console.log(`Processed paragraph #${index + 1}`, result);
          } else {
            console.log(`Skipping paragraph #${index + 1} (invalid)`, attempt);
          }
        });

        return combinedResult;
      });

      console.log("Final miscues by passage:", miscues);
      setMiscueData(miscues);
    }
  }, [student, allAssessmentAttempts, assessments]);

  return (
    <div className="classroom">
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
              <ReadingProgressBarCard miscues={miscueData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid-container">
        <Card className="card" onClick={() => trackEvent("click_accuracy_fluency", "User clicked on Overall Accuracy & Fluency Chart")}
          onMouseEnter={() => trackEvent("hover_accuracy_fluency", "User hovered over Overall Accuracy & Fluency Chart", "hover")}
        >
          <CardContent>
            {/* <OverallAccuracyFluencyChart data={overallPerformanceData} /> */}
          </CardContent>
        </Card>

        <Card className="card" onClick={() => trackEvent("click_student_engagement", "User clicked on Class Engagement Bubble Chart")}
          onMouseEnter={() => trackEvent("hover_student_engagement", "User hovered over Class Engagement Bubble Chart", "hover")}
        >
          <CardContent>
            <ClassEngagementBubbleChart student={student} /> {/* Replaced with ClassEngagementBubbleChart */}
          </CardContent>
        </Card>

        <Card className="card" onClick={() => trackEvent("click_word_accuracy_distribution", "User clicked on Word Accuracy Distribution Chart")}
          onMouseEnter={() => trackEvent("hover_word_accuracy_distribution", "User hovered over Word Accuracy Distribution Chart", "hover")}
        >
          <CardContent>
            <WordAccuracyStudent student={student} miscues={miscueData} />
          </CardContent>
        </Card>

        <Card className="card" onClick={() => trackEvent("click_misread_words", "User clicked on Top Misread Words Chart")}
          onMouseEnter={() => trackEvent("hover_misread_words", "User hovered over Top Misread Words Chart", "hover")}
        >
          <CardContent>
            <TopMisreadWordsChart data={misreadData} />
          </CardContent>
        </Card>

        <Card className="card" onClick={() => trackEvent("click_reading_assessment", "User clicked on Reading Assessment Line Graph")}
          onMouseEnter={() => trackEvent("hover_reading_assessment", "User hovered over Reading Assessment Line Graph", "hover")}
        >
          <CardContent>
            <ReadingAssessmentDataLineGraph student={student} />
          </CardContent>
        </Card>

        <Card className="card" onClick={() => trackEvent("click_student_summary", "User clicked on Student Performance Summary")}
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
