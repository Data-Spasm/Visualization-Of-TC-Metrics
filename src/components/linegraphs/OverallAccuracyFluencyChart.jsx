import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from "recharts";
import "./ReadingAssessmentDataLineGraph.css";

// This component visualizes the overall accuracy and fluency of students in a bar chart format
const performanceBands = [
  { range: "0-49", min: 0, max: 49 },
  { range: "50-74", min: 50, max: 74 },
  { range: "75-89", min: 75, max: 89 },
  { range: "90-100", min: 90, max: 100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const accuracy = payload.find(p => p.name === "Accuracy")?.value || 0;
    const fluency = payload.find(p => p.name === "Fluency")?.value || 0;

    return (
      <div className="custom-tooltip">
        <strong>Range: {label}</strong>
        <p>{accuracy} students have accuracy in this range</p>
        <p>{fluency} students have fluency in this range</p>
      </div>
    );
  }

  return null;
};

// This component is responsible for rendering the Overall Accuracy and Fluency chart
const OverallAccuracyFluencyChart = ({ students = [] }) => {
  const [binnedData, setBinnedData] = useState([]);
  const [storySummary, setStorySummary] = useState("");

  useEffect(() => {
    const bands = performanceBands.map(({ range, min, max }) => {
      let accuracyCount = 0;
      let fluencyCount = 0;

      students.forEach((student) => {
        const accuracy = student.student?.reading?.overallPerformance?.overallAccuracy * 100 || 0;
        const fluency = student.student?.reading?.overallPerformance?.overallFluency || 0;

        if (accuracy >= min && accuracy <= max) accuracyCount++;
        if (fluency >= min && fluency <= max) fluencyCount++;
      });

      return { range, Accuracy: accuracyCount, Fluency: fluencyCount };
    });

    setBinnedData(bands);

    // Data Storytelling Summary
    const mostAccurateBand = [...bands].sort((a, b) => b.Accuracy - a.Accuracy)[0];
    const mostFluentBand = [...bands].sort((a, b) => b.Fluency - a.Fluency)[0];

    const summary = `Most students are achieving accuracy in the ${mostAccurateBand.range} range 
      and fluency in the ${mostFluentBand.range} range. Use this insight to identify students needing support.`;

    setStorySummary(summary);
  }, [students]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Overall Accuracy & Fluency</h3>

      <div className="story-summary">
        <p>{storySummary}</p>
      </div>

      <ResponsiveContainer width="100%" height={355}>
      <BarChart
        data={binnedData}
        margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
        barCategoryGap={5}
        barSize={35}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" label={{ value: "Score Range", position: "insideBottom", offset: -5 }} />
        <YAxis
          allowDecimals={false}
          label={{ value: "Number of Students", angle: -90, position: "insideLeft", offset: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="Accuracy" fill="#8884d8">
          <LabelList dataKey="Accuracy" position="top" />
        </Bar>
        <Bar dataKey="Fluency" fill="#82ca9d">
          <LabelList dataKey="Fluency" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: "1rem",
        fontSize: "0.9vw",
        lineHeight: "1.6em",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "12px", height: "12px", background: "#8884d8" }}></span> Accuracy
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "12px", height: "12px", background: "#82ca9d" }}></span> Fluency
      </span>
    </div>

      <div className="callout-block">
        <p>
          <strong>Tip:</strong> Hover over the 0–49 band to explore how many students are in that accuracy and fluency range.
        </p>
      </div>
    </div>
  );
};

export default OverallAccuracyFluencyChart;