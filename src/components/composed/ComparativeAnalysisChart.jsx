import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ComparativeAnalysisChart.css";

const ComparativePerformanceChart = ({ miscues = [], classAverages = [] }) => {
  const mergedData = miscues.map((entry) => {
    const classAvg = classAverages.find(avg => avg.passageId === entry.passageId);
    const total = (entry.numCorrect || 0) + (entry.numDels || 0) + (entry.numSubs || 0);
    const miscueRate = total > 0
      ? (((entry.numDels || 0) + (entry.numSubs || 0)) / total) * 100
      : 0;

    return {
      passage: entry.passage,
      studentCorrect: entry.numCorrect || 0,
      studentAttempts: entry.studentAttempts || 0,
      classCorrect: classAvg?.avgCorrect || 0,
      classAttempts: classAvg?.classAttempts || 0,
      miscueRate: +miscueRate.toFixed(2),
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length > 0) {
      const entry = payload[0].payload;

      return (
        <div style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: 6,
          maxWidth: 260
        }}>
          <strong>{label}</strong>
          <p style={{ color: "#3b82f6", margin: 0 }}>Student Correct: {entry.studentCorrect}</p>
          <p style={{ color: "#10b981", margin: 0 }}>Class Average: {entry.classCorrect.toFixed(2)}</p>
          <p style={{ color: "#ef4444", margin: 0 }}>Miscue Rate: {entry.miscueRate}%</p>
          <p style={{ marginTop: 4, fontStyle: "italic", fontSize: "12px", color: "#666" }}>
            Based on {entry.classAttempts} class attempt{entry.classAttempts !== 1 ? 's' : ''}<br />
            and {entry.studentAttempts} student attempt{entry.studentAttempts !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="comparative-card">
      <h4 className="comparative-title">Comparative Performance Analysis</h4>
      <div className="comparative-chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={mergedData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="passage" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: 'Correct Words', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Miscue Rate (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="studentCorrect" name="Student Correct" fill="#3b82f6" />
            <Bar yAxisId="left" dataKey="classCorrect" name="Class Average" fill="#10b981" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="miscueRate"
              name="Miscue Rate (%)"
              stroke="#ef4444"
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparativePerformanceChart;