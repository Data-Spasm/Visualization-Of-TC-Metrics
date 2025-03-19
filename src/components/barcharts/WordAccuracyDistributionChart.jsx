import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import "./WordAccuracyDistributionChart.css";

// Define bins for class-wide data
const bins = [0, 50, 100, 150, 200, 250];
const binLabels = ["0-50", "51-100", "101-150", "151-200", "201-250"];

// Function to process class-wide data
const groupWordAccuracy = (students) => {
  return bins.map((bin, index) => ({
    range: binLabels[index],
    count: students.filter(student => student.overallPerformance.correctWords >= bin && student.overallPerformance.correctWords < (bins[index + 1] || Infinity)).length
  }));
};

// Function to determine color based on range or correct words
const getColor = (value, isStudent) => {
  if (isStudent) {
    if (value <= 50) return "red";
    if (value <= 100) return "orange";
    if (value <= 150) return "yellow";
    if (value <= 200) return "green";
    return "blue";
  } else {
    switch (value) {
      case "0-50":
        return "red";
      case "51-100":
        return "orange";
      case "101-150":
        return "yellow";
      case "151-200":
        return "green";
      case "201-250":
        return "blue";
      default:
        return "#ccc";
    }
  }
};

// **Main Component**
const WordAccuracyDistributionChart = ({ student = null }) => {
  const [processedData, setProcessedData] = useState([]);

  // Mock data for class-wide distribution
  const mockStudents = [
    { overallPerformance: { correctWords: 45 } },
    { overallPerformance: { correctWords: 60 } },
    { overallPerformance: { correctWords: 75 } },
    { overallPerformance: { correctWords: 120 } },
    { overallPerformance: { correctWords: 75 } },
    { overallPerformance: { correctWords: 120 } },
    { overallPerformance: { correctWords: 130 } },
    { overallPerformance: { correctWords: 160 } },
    { overallPerformance: { correctWords: 180 } },
    { overallPerformance: { correctWords: 210 } },
    { overallPerformance: { correctWords: 230 } },
    { overallPerformance: { correctWords: 250 } },
  ];

  // Mock data for individual student (per passage)
  const mockStudentData = [
    { passage: "Passage 1", correctWords: 180, totalWords: 200 },
    { passage: "Passage 2", correctWords: 130, totalWords: 200 },
    { passage: "Passage 3", correctWords: 90, totalWords: 200 },
    { passage: "Passage 4", correctWords: 50, totalWords: 200 },
  ];

  useEffect(() => {
    if (student) {
      // Process data for **individual student**
      const studentData = mockStudentData.map(entry => ({
        passage: entry.passage,
        correctWords: entry.correctWords,
        accuracy: (entry.correctWords / entry.totalWords) * 100, // Convert to percentage
      }));
      setProcessedData(studentData);
    } else {
      // Process data for **class-wide** distribution
      setProcessedData(groupWordAccuracy(mockStudents));
    }
  }, [student]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {student ? `${student.firstName}'s Word Accuracy` : "Word Accuracy Distribution"}
      </h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={student ? "passage" : "range"} 
            label={{ value: student ? "Passages" : "Correct Words", position: "insideBottom", offset: -5 }} 
          />
          <YAxis 
            label={{ value: student ? "Correct Words" : "Number of Students", angle: -90, position: "insideLeft" }} 
            allowDecimals={false} 
            domain={[0, "auto"]} 
          />
          <Tooltip 
            formatter={(value, name, props) => {
              if (student) return [`Accuracy: ${props.payload.accuracy.toFixed(1)}%`, "Correct Words"];
              return [value, "Number of Students"];
            }}
          />
          <Bar dataKey={student ? "correctWords" : "count"} barSize={40}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(student ? entry.correctWords : entry.range, !!student)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WordAccuracyDistributionChart;