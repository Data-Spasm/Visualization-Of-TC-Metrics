import React, { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { calculateClassEngagement } from "../../utils/calculateClassEngagement"; // Importing the function
import './ClassEngagementBubbleChart.css';

const ClassEngagementBubbleChart = ({ readingAttempts }) => {
  const [engagementData, setEngagementData] = useState([]);

  // Mock data for testing
  const mockData = [
    { title: "Passage 1", quit: false },
    { title: "Passage 1", quit: false },
    { title: "Passage 1", quit: true },
    { title: "Passage 1", quit: false },
    { title: "Passage 2", quit: false },
    { title: "Passage 2", quit: true },
    { title: "Passage 2", quit: true },
    { title: "Passage 3", quit: false },
    { title: "Passage 3", quit: false },
    { title: "Passage 3", quit: false },
    { title: "Passage 3", quit: true },
    { title: "Passage 4", quit: false },
    { title: "Passage 4", quit: false },
    { title: "Passage 5", quit: true },
    { title: "Passage 5", quit: true },
    { title: "Passage 5", quit: false }
  ];

  useEffect(() => {
    // Use mock data if no readingAttempts is passed
    const dataToUse = readingAttempts && readingAttempts.length > 0 ? readingAttempts : mockData;

    if (dataToUse && dataToUse.length > 0) {
      const engagement = calculateClassEngagement(dataToUse);
      setEngagementData(engagement);
    }
  }, [readingAttempts]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Class Engagement with Reading Passages</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis 
            dataKey="passageTitle" 
            name="Passage Title" 
            tick={{ fontSize: 14, fill: '#333' }} 
          />
          <YAxis 
            dataKey="completionRate" 
            name="Completion Rate (%)" 
            tick={{ fontSize: 14, fill: '#333' }}
            label={{ value: 'Completion Rate (%)', angle: -90, position: 'insideLeft', fontSize: 14 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '13px',
              padding: '10px'
            }}
            itemStyle={{ color: '#555' }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
          />
          <Scatter 
            name="Class Engagement"
            data={engagementData}
            fill="#8884d8"
            shape="circle"
            sizeKey="bubbleSize" // Bubbles will vary in size based on the number of attempts
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassEngagementBubbleChart;
