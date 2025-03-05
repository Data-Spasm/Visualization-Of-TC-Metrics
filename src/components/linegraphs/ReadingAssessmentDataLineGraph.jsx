import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./ReadingAssessmentDataLineGraph.css";

const ReadingAssessmentDataLineGraph = ({ data }) => {
  return (
    <div className="reading-assessment-graph">
      <h2>Reading Assessment Data</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="numberOfPassages" label={{ value: "Number of Passages", position: "bottom", dy: 10 }} />
          <YAxis label={{ value: "Number of Students", angle: -90, position: "insideLeft", dy: -10 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="passagesPlayed" stroke="#FFA500" strokeWidth={2} dot={{ fill: "#FFA500" }} name="Passages Played" />
          <Line type="monotone" dataKey="passagesFinished" stroke="#32CD32" strokeWidth={2} dot={{ fill: "#32CD32" }} name="Passages Finished" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadingAssessmentDataLineGraph;
