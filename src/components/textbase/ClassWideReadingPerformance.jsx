import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import calculateReadingScore from "../../utils/readingScore"; 
import "./ClassWideReadingPerformance.css";

const ClassWideReadingPerformance = ({ students }) => {
  const [readingScores, setReadingScores] = useState({ classReadingScore: 0, overallPerformanceScore: 0 });

  useEffect(() => {
    // Mock Data for Class-Wide Performance 
    if (!students || students.length === 0) {
      students = [
        {
          id: 1,
          name: "Student 1",
          overallPerformance: { accuracy: 85, fluency: 90, timeOnTask: 300 },
          readingAttempts: [{ passageId: 1, duration: 120, attemptNumber: 1 }],
        },
        {
          id: 2,
          name: "Student 2",
          overallPerformance: { accuracy: 78, fluency: 82, timeOnTask: 250 },
          readingAttempts: [{ passageId: 1, duration: 110, attemptNumber: 1 }],
        },
        {
          id: 3,
          name: "Student 3",
          overallPerformance: { accuracy: 92, fluency: 88, timeOnTask: 320 },
          readingAttempts: [{ passageId: 1, duration: 130, attemptNumber: 1 }],
        },
      ];
    }

    if (students && students.length > 0) {
      const individualScores = students.map(student => 
        calculateReadingScore([student]).classReadingScore
      );

      const overallScore = individualScores.reduce((acc, score) => acc + parseFloat(score), 0) / individualScores.length;

      setReadingScores({
        classReadingScore: overallScore.toFixed(2),
        overallPerformanceScore: overallScore.toFixed(2) 
      });
    }
  }, [students]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Class-Wide Reading Performance</h3>
      <ResponsiveContainer width="100%" height={450}>
        <div className="performance-card">
          <p><strong>Class Reading Score:</strong> {readingScores.classReadingScore}</p>
          <p><strong>Overall Performance Score:</strong> {readingScores.overallPerformanceScore}</p>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassWideReadingPerformance;
