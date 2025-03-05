import React, { useState, useEffect } from "react";
import calculateReadingScore from "../../utils/readingScore"; // FIXED IMPORT PATH
import "./ClassWideReadingPerformance.css";

const ClassWideReadingPerformance = ({ students }) => {
  const [readingScores, setReadingScores] = useState({ classReadingScore: 0, overallPerformanceScore: 0 });

  useEffect(() => {
    setReadingScores(calculateReadingScore(students));
  }, [students]);

  return (
    <div className="performance-card">
      <h3>Class-Wide Reading Performance</h3>
      <p><strong>Class Reading Score:</strong> {readingScores.classReadingScore}</p>
      <p><strong>Overall Performance Score:</strong> {readingScores.overallPerformanceScore}</p>
    </div>
  );
};

export default ClassWideReadingPerformance;
