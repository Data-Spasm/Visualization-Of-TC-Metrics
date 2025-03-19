import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import calculateReadingScore from "../../utils/readingScore"; 
import "./ClassWideReadingPerformance.css";

const StudentReadingPerformance = ({ student }) => {
  const [readingScores, setReadingScores] = useState({ readingScore: 0, overallPerformanceScore: 0 });

  useEffect(() => {
    // Mock Data for Student 1 
    if (!student) {
      student = {
        id: 1,
        name: "Student 1",
        overallPerformance: {
          accuracy: 85,
          fluency: 90,
          timeOnTask: 300, 
        },
        misreadWords: [
          { word: "cat", count: 3 },
          { word: "dog", count: 2 },
          { word: "fish", count: 1 },
        ],
        readingAttempts: [
          { passageId: 1, duration: 120, attemptNumber: 1 },
          { passageId: 1, duration: 180, attemptNumber: 2 },
          { passageId: 2, duration: 150, attemptNumber: 1 },
        ],
      };
    }

    if (student) {
      const studentReadingScore = calculateReadingScore([student]).classReadingScore;
      setReadingScores({
        readingScore: studentReadingScore,
        overallPerformanceScore: studentReadingScore,
      });
    }
  }, [student]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Reading Performance for {student.name}</h3>
      <ResponsiveContainer width="100%" height={450}>
        <div className="performance-card">
          <p><strong>Reading Score:</strong> {readingScores.readingScore}</p>
          <p><strong>Overall Performance Score:</strong> {readingScores.overallPerformanceScore}</p>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentReadingPerformance;

