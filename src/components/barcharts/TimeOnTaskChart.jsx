// We decided not to use this card

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import "./TimeOnTaskChart.css";

// Function to group students into bins
const groupTimeOnTask = (students) => {
  const bins = [0, 200, 400, 600, 800, 1000]; // Ranges for grouping time on task
  const binLabels = ["0-200", "200-400", "400-600", "600-800", "800-1000"];

  let groupedData = bins.map((bin, index) => ({
    range: binLabels[index],
    count: students.filter(student => student.timeOnTask >= bin && student.timeOnTask < (bins[index + 1] || Infinity)).length
  }));

  return groupedData;
};

// Define color scale
const getColor = (range) => {
  switch (range) {
    case "0-200":
      return "green"; // Green
    case "200-400":
      return "yellow"; // Yellow
    case "400-600":
      return "orange"; // Orange
    case "600-800":
      return "#ff5722"; // Deep Orange
    case "800-1000":
      return "red"; // Red
    default:
      return "#ccc"; // Default color
  }
};

const TimeOnTaskChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Loading chart...</p>;
  }

  const processedData = groupTimeOnTask(data);
  const studentCount = Math.max(...processedData.map(d => d.count), 1); // Ensure at least 1 tick

  return (
    <div className="chart-container">
      <h3 className="chart-title">Overall Time On Task</h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" label={{ value: "Time on Task (Seconds)", position: "insideBottom", offset: -5 }} />
          <YAxis 
            label={{ value: "Number of Students", angle: -90, position: "insideLeft" }} 
            allowDecimals={false}  // Prevents fractional numbers
            domain={[0, "auto"]}   // Keeps the scale automatic but ensures no decimals
            tickCount={studentCount} // Ensures whole number increments
          />
          <Tooltip />
          <Bar dataKey="count" barSize={40}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeOnTaskChart;