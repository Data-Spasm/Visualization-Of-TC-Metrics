import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import "./ReadingAssessmentDataLineGraph.css";

const performanceBands = [
  { range: "0-49", min: 0, max: 49 },
  { range: "50-74", min: 50, max: 74 },
  { range: "75-89", min: 75, max: 89 },
  { range: "90-100", min: 90, max: 100 },
];

const OverallAccuracyFluencyChart = ({ students = [] }) => {
  const [binnedData, setBinnedData] = useState([]);

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

      return {
        range,
        Accuracy: accuracyCount,
        Fluency: fluencyCount,
      };
    });

    setBinnedData(bands);
  }, [students]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Overall Accuracy & Fluency</h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={binnedData}
          margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" label={{ value: "Score Range", position: "insideBottom", offset: -5 }} />
          <YAxis
            allowDecimals={false}
            label={{ value: "Number of Students", angle: -90, position: "insideLeft", offset: 10 }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Accuracy" fill="#8884d8">
            <LabelList dataKey="Accuracy" position="top" />
          </Bar>
          <Bar dataKey="Fluency" fill="#82ca9d">
            <LabelList dataKey="Fluency" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallAccuracyFluencyChart;