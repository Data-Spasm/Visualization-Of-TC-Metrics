import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import calculateReadingScore from "../../utils/readingScore"; // FIXED IMPORT PATH
import "./ClassWideReadingPerformance.css";

const ClassWideReadingPerformance = ({ students }) => {
  const [readingScores, setReadingScores] = useState({ classReadingScore: 0, overallPerformanceScore: 0 });

  useEffect(() => {
    setReadingScores(calculateReadingScore(students));
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