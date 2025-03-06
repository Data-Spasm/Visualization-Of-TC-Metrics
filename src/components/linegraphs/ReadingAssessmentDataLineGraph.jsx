import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./ReadingAssessmentDataLineGraph.css";

const ReadingAssessmentDataLineGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Mock data with weeks and corresponding number of students for passages played and finished
    const mockReadingAttempts = [
      { week: "Week 1", passagesPlayed: 0, passagesFinished: 0 },
      { week: "Week 2", passagesPlayed: 5, passagesFinished: 3 },
      { week: "Week 3", passagesPlayed: 10, passagesFinished: 7 },
      { week: "Week 4", passagesPlayed: 20, passagesFinished: 3 },
    ];

    setData(mockReadingAttempts);
  }, []);

  return (
    <div className="chart-container">
      <div className="chart-title">Reading Assessment Data</div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            label={{ value: "Number of Passages", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{ value: "Number of Students", angle: -90, position: "insideLeft", dy: -10 }}
            domain={[0, 'dataMax']}
          />
          <Tooltip />
          <Line type="monotone" dataKey="passagesPlayed" stroke="#FFA500" name="Passages Played" />
          <Line type="monotone" dataKey="passagesFinished" stroke="#32CD32" name="Passages Finished" />
        </LineChart>
      </ResponsiveContainer>
      <div className="key-container">
        <div className="key-item">
          <div className="key-color" style={{ backgroundColor: '#FFA500' }}></div>
          <span>Passages Played</span>
        </div>
        <div className="key-item">
          <div className="key-color" style={{ backgroundColor: '#32CD32' }}></div>
          <span>Passages Finished</span>
        </div>
      </div>
      {data.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default ReadingAssessmentDataLineGraph;
