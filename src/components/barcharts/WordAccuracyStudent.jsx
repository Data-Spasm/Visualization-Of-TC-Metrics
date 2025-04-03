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
import { useNavigate } from "react-router-dom";
import "./WordAccuracyDistributionChart.css";

// Color scale based on % of total words
const getColor = (correct, total) => {
  const percent = (correct / total) * 100;
  if (percent <= 25) return "#ef4444";   // Red
  if (percent <= 50) return "#f97316";   // Orange
  if (percent <= 75) return "#facc15";   // Yellow
  if (percent < 100) return "#22c55e";   // Green
  return "#3b82f6";                      // Blue
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = ((data.correctWords / data.totalWords) * 100).toFixed(1);
    const percentColor = getColor(data.correctWords, data.totalWords);

    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "10px 12px",
          fontSize: "13px",
          color: "#111827",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          maxWidth: "240px",
          lineHeight: "1.4"
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
          Passage {label}
        </div>
        <div style={{ fontWeight: 500 }}>{data.fullTitle}</div>
        <div style={{ marginTop: "6px", fontSize: "13px", color: "#4b5563" }}>
          <span style={{ color: percentColor, fontWeight: 600 }}>
            {percent}% correct
          </span><br />
          {data.correctWords} / {data.totalWords} words
        </div>
      </div>
    );
  }
  return null;
};


const WordAccuracyDistributionChart = ({ student, students, miscues = [] }) => {
  const [processedData, setProcessedData] = useState([]);
  const [insight, setInsight] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (student) {
      const validMiscues = Array.isArray(miscues) ? miscues : [];

      if (validMiscues.length > 0) {
        const studentData = validMiscues.map((entry, index) => {
          const correctWords = entry.numCorrect || 0;
          const totalWords = entry.totalWords || (
            entry.numCorrect + entry.numDels + entry.numSubs + entry.numIns + entry.numReps + entry.numRevs || 1
          );

          return {
            passage: `P${index + 1}`,
            fullTitle: entry.passageTitle || `Passage ${index + 1}`,
            correctWords,
            totalWords,
            passageId: entry.passageId
          };
        });

        setProcessedData(studentData);

        const sorted = [...studentData].sort((a, b) => b.correctWords - a.correctWords);
        const highest = sorted[0];
        const lowest = sorted[sorted.length - 1];

        if (highest.correctWords === lowest.correctWords) {
          setInsight(`${student.firstName}'s correct word counts were consistent across passages.`);
        } else {
          setInsight(`Greatest correct word count was in "${highest.fullTitle}" with ${highest.correctWords} words. The lowest was in "${lowest.fullTitle}" with ${lowest.correctWords} words.`);
        }
      } else {
        setInsight(`No passage accuracy data available for ${student.firstName}.`);
      }
    } else if (Array.isArray(students)) {
      setProcessedData([]);
    }
  }, [student, students, miscues]);

  const handleBarClick = (data) => {
    if (data?.passageId && student?.username) {
      navigate(`/passages/${student.username}/${data.passageId}`);
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {student ? `${student.firstName}'s Word Accuracy by Passage` : "Student Word Accuracy"}
      </h3>

      {insight && <div className="story-summary"><p>{insight}</p></div>}

      <ResponsiveContainer width="100%" height={355}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          onClick={(e) => handleBarClick(e.activePayload?.[0]?.payload)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
          dataKey="passage"
          label={{
            value: "Passages",
            position: "insideBottom",
            offset: -5,
            style: { fontSize: 12 } 
          }}
          interval={0}
          tick={{ fontSize: 12 }} 
        />
        <YAxis
          label={{
            value: "Correct Words",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12 }
          }}
          allowDecimals={false}
          domain={[0, "auto"]}
          tick={{ fontSize: 12 }}
        />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
          />
          <Bar dataKey="correctWords" barSize={40}>
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.correctWords, entry.totalWords)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {processedData.length > 0 && (
        <div className="legend-block stuti-style">
          <div className="legend-item"><span className="legend-square" style={{ backgroundColor: '#ef4444' }} /> 0–25% correct</div>
          <div className="legend-item"><span className="legend-square" style={{ backgroundColor: '#f97316' }} /> 26–50% correct</div>
          <div className="legend-item"><span className="legend-square" style={{ backgroundColor: '#facc15' }} /> 51–75% correct</div>
          <div className="legend-item"><span className="legend-square" style={{ backgroundColor: '#22c55e' }} /> 76–99% correct</div>
          <div className="legend-item"><span className="legend-square" style={{ backgroundColor: '#3b82f6' }} /> 100%+ correct</div>
        </div>
      )}

      {processedData.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> Use this chart to identify passages that may need re-teaching or vocabulary instruction, especially those with lower correct word counts relative to the passage length.
        </div>
      )}
    </div>
  );
};

export default WordAccuracyDistributionChart;