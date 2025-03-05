import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import "./TopMisreadWordsChart.css";

const getColor = (count) => {
  if (count > 5) return "red"; // Red for high counts
  if (count > 3) return "orange"; // Orange for medium counts
  if (count > 1) return "yellow"; // Yellow for low counts
  return "green"; // Yellow for low counts
};

const TopMisreadWordsChart = ({ data }) => {
  console.log("TopMisreadWordsChart data:", data);

  if (!data || data.length === 0) {
    return <p>Loading chart...</p>;
  }

  // Ensure count values are integers
  const formattedData = data.map(entry => ({
    ...entry,
    count: Math.floor(entry.count)
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Top Misread Words by Students</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: "Number of Times Misread", position: "insideBottom", offset: -5 }} tick={{ fontSize: 14 }} />
          <YAxis type="category" dataKey="word" label={{ value: "Misread Words", angle: -90, position: "insideLeft", dx: -20 }} tick={{ fontSize: 14 }} />
          <Tooltip />
          <Bar dataKey="count" barSize={20}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.count)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopMisreadWordsChart;