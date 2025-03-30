import React, { useState, useEffect } from "react";
import {  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Tooltip} from "recharts";
import calculateReadingScore from "../../utils/readingScore";
import "./ClassWideReadingPerformance.css";

const getInsight = (score, type) => {
  if (score < 30) {
    return { message: `${type} is significantly low. Immediate support needed.`, color: "#e74c3c" };
  } else if (score < 50) {
    return { message: `${type} is below average. Consider targeted improvement strategies.`, color: "#f39c12" };
  } else if (score < 70) {
    return { message: `${type} is proficient. Build on this momentum.`, color: "#f1c40f" };
  } else {
    return { message: `${type} is excellent. Maintain the progress.`, color: "#2ecc71" };
  }
};

const renderCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const insight = getInsight(item.value, item.name);
    return (
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        maxWidth: 220
      }}>
        <strong>{item.name} Score: {item.value}%</strong>
        <p style={{ marginTop: 6, fontSize: "13px", color: "#555" }}>{insight.message}</p>
      </div>
    );
  }
  return null;
};

const ClassWideReadingPerformance = ({ students }) => {
  const [readingScores, setReadingScores] = useState({
    classReadingScore: 0,
    overallPerformanceScore: 0
  });

  const [readingInsight, setReadingInsight] = useState(null);
  const [performanceInsight, setPerformanceInsight] = useState(null);

  useEffect(() => {
    if (!students || students.length === 0) return;

    const scores = calculateReadingScore(students);
    setReadingScores(scores);

    setReadingInsight(getInsight(parseFloat(scores.classReadingScore), "Reading score"));
    setPerformanceInsight(getInsight(parseFloat(scores.overallPerformanceScore), "Performance score"));
  }, [students]);

  const chartData = [
    {
      name: "Reading",
      value: parseFloat(readingScores.classReadingScore),
      fill: readingInsight?.color || "#3498db"
    },
    {
      name: "Performance",
      value: parseFloat(readingScores.overallPerformanceScore),
      fill: performanceInsight?.color || "#9b59b6"
    }
  ];

  return (
    <div className="overview-performance">
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="70%"
          startAngle={180}
          endAngle={0}
          innerRadius="50%"
          outerRadius="100%"
          barSize={15}
          data={chartData}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            minAngle={15}
            background={false}
            clockWise
            dataKey="value"
            cornerRadius={5}
          />
          <Tooltip content={renderCustomTooltip} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="score-labels">
        <p><strong>Class Reading Score:</strong> {readingScores.classReadingScore}%</p>
        <p><strong>Overall Performance Score:</strong> {readingScores.overallPerformanceScore}%</p>
      </div>

      {readingInsight && (
        <div className="insight-container">
          <div className="insight-indicator" style={{ backgroundColor: readingInsight.color }}></div>
          <div className="insight-text">{readingInsight.message}</div>
        </div>
      )}

      {performanceInsight && (
        <div className="insight-container">
          <div className="insight-indicator" style={{ backgroundColor: performanceInsight.color }}></div>
          <div className="insight-text">{performanceInsight.message}</div>
        </div>
      )}
    </div>
  );
};

export default ClassWideReadingPerformance;