import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import "./WordAccuracyDistributionChart.css";

// Color scale based on correct word count
const getColor = (value) => {
  if (value <= 50) return "#ef4444";   // Red
  if (value <= 100) return "#f59e0b";  // Orange
  if (value <= 150) return "#facc15";  // Yellow
  if (value <= 200) return "#22c55e";  // Green
  return "#3b82f6";                    // Blue
};

const WordAccuracyDistributionChart = ({ student, students, miscues = [] }) => {
  const [processedData, setProcessedData] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    if (student) {
      const validMiscues = Array.isArray(miscues) ? miscues : [];
      if (validMiscues.length > 0) {
        const studentData = validMiscues.map((entry, index) => ({
          passage: `P${index + 1}`,
          fullTitle: entry.passageTitle || `Passage ${index + 1}`,
          correctWords: entry.numCorrect || 0,
        }));

        setProcessedData(studentData);

        // Story Summary
        const sorted = [...studentData].sort((a, b) => b.correctWords - a.correctWords);
        const highest = sorted[0];
        const lowest = sorted[sorted.length - 1];

        if (highest.correctWords === lowest.correctWords) {
          setInsight(`${student.firstName}'s performance was consistent across all passages.`);
        } else {
          setInsight(
            `Highest number of correct words was in "${highest.fullTitle}" (${highest.correctWords}). Lowest was in "${lowest.fullTitle}" (${lowest.correctWords}).`
          );
        }
      } else {
        setInsight(`No passage accuracy data available for ${student.firstName}.`);
      }
    } else if (Array.isArray(students)) {
      setProcessedData([]);
    }
  }, [student, students, miscues]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {student ? `${student.firstName}'s Correct Words per Passage` : "Student Word Accuracy"}
      </h3>
  
      {/* Story summary placed at the top */}
      {insight && (
        <div className="story-summary">
          <p>{insight}</p>
        </div>
      )}
  
      <ResponsiveContainer width="100%" height={355}>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="passage"
            label={{ value: "Passages", position: "insideBottom", offset: -5 }}
            interval={0}
          />
          <YAxis
            label={{ value: "Correct Words", angle: -90, position: "insideLeft" }}
            allowDecimals={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} correct words`, props.payload.fullTitle]}
          />
          <Bar dataKey="correctWords" barSize={40}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.correctWords)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
  
      {/* Teaching Tip */}
      {processedData.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> Use this chart to identify passages that may need re-teaching or targeted vocabulary instruction, especially those with lower correct word counts.
        </div>
      )}
    </div>
  );
  
};

export default WordAccuracyDistributionChart;
