import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./ReadingAssessmentDataLineGraph.css";

const ReadingAssessmentDataLineGraph = ({ studentId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate mock data for 10 students with logical attempts
    const generateMockData = (id) => {
      const mockReadingAttempts = [];
      for (let i = 1; i <= 6; i++) {
        const passagesPlayed = Math.floor(Math.random() * 8) + 2; // Random value between 2 and 9
        const passagesFinished = Math.floor(Math.random() * (passagesPlayed + 1)); // Random value between 0 and passagesPlayed

        mockReadingAttempts.push({
          week: `Week ${i}`,
          passagesPlayed,
          passagesFinished,
        });
      }
      return mockReadingAttempts;
    };

    // Get mock data for the selected student
    const studentData = generateMockData(studentId);
    setData(studentData);
  }, [studentId]);

  return (
    <div className="chart-container">
      <div className="chart-title">Reading Assessment Data for Student {studentId}</div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" label={{ value: "Weeks", position: "insideBottom", offset: -10 }} />
          <YAxis
            label={{ value: "Number of Passages", angle: -90, position: "insideLeft", dy: -10 }}
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


