import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Label,
  Legend,
  Sector
} from "recharts";
import "./WordAccuracyDistributionChart.css";

const getColor = (value, isStudent = true, index = 0) => {
  if (isStudent) {
    if (value <= 50) return "red";
    if (value <= 100) return "orange";
    if (value <= 150) return "yellow";
    if (value <= 200) return "green";
    return "blue";
  } else {
    const colors = ["red", "orange", "yellow", "green", "blue"];
    return colors[index % colors.length];
  }
};

const abbreviateTitle = (title, maxWords = 3) => {
  const words = title.split(" ");
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : title;
};

const WordAccuracyDistributionChart = ({ student, students, miscues = [] }) => {
    const [processedData, setProcessedData] = useState([]);
  
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
        } else {
          console.warn("No valid miscues provided for student.");
        }
      } else if (Array.isArray(students)) {
        setProcessedData([]);
      }
    }, [student, students, miscues]);
  
    const getInsightMessage = () => {
      if (!processedData.length) return null;
      const highest = [...processedData].sort((a, b) => b.correctWords - a.correctWords)[0];
      const lowest = [...processedData].sort((a, b) => a.correctWords - b.correctWords)[0];
      if (highest.correctWords === lowest.correctWords) {
        return `Performance was consistent across all passages.`;
      }
      return `Highest correct words were in "${highest.fullTitle}". Lowest was in "${lowest.fullTitle}".`;
    };
  
    return (
      <div className="chart-container">
        <h3 className="chart-title">
          {student ? `Correct Words per Passage` : "Student Word Accuracy"}
        </h3>
  
        <ResponsiveContainer width="100%" height={420}>
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
  
        <div className="chart-insight">
          <em>{getInsightMessage()}</em>
        </div>
      </div>
    );
  };
  

export default WordAccuracyDistributionChart;
