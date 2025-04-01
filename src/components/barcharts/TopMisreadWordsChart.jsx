// We decided not to use this card

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const getColor = (index) => {
  const colors = ["#FF5733", "#FFB400", "#FFD700", "#4CAF50", "#008080"];
  return colors[index % colors.length];
};

const TopMisreadWordsChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Top Misread Words</h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="word" label={{ value: "Words", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} allowDecimals={false} domain={[0, "auto"]} />
          <Tooltip />
          <Bar dataKey="count" barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopMisreadWordsChart;
