import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './OverallAccuracyFluencyChart.css';

const OverallAccuracyFluencyChart = ({ data = [], onDataProcessed }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mock data for presentation
    const mockData = [
      // { week: "Week 1", accuracy: 0.12, fluency: 10 },
      { week: "Week 2", accuracy: 0.24, fluency: 13 },
      { week: "Week 3", accuracy: 0.16, fluency: 5 },
      { week: "Week 4", accuracy: 0.2, fluency: 6 },
      { week: "Week 5", accuracy: 0.3, fluency: 12 },
    ];

    // Combine provided data with mock data
    const combinedData = [...data,...mockData];

    console.log("Processed Data for Chart:", combinedData);

    const processedData = combinedData.map((performance, index) => ({
      week: `Week ${index + 1}`,
      accuracy: performance.accuracy * 100, // Convert to percentage
      fluency: performance.fluency,
    }));

    setChartData(processedData);

    // Call the parent function with the processed data
    if (onDataProcessed) {
      onDataProcessed(processedData);
    }
  }, [data, onDataProcessed]);

  // Calculate the maximum value for the Y-axis
  const maxYValue = Math.max(...chartData.map(d => Math.max(d.accuracy, d.fluency)));
  // Generate ticks for the Y-axis in increments of 5
  const yAxisTicks = Array.from({ length: Math.ceil(maxYValue / 5) + 1 }, (_, i) => i * 5);

  return (
    <div className="chart-container">
      <div className="chart-title">Overall Accuracy & Fluency Trend</div>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" label={{ value: "Week", position: "insideBottom", offset: -10 }} />
          <YAxis 
            label={{ value: "Performance Metrics", angle: -90, position: "insideLeft", dy: -10 }} 
            ticks={yAxisTicks} // Set the ticks explicitly
            domain={[0, 'dataMax']} 
          />
          <Tooltip />
          <Line type="monotone" dataKey="accuracy" stroke="#ff7300" name="Accuracy (%)" />
          <Line type="monotone" dataKey="fluency" stroke="#4caf50" name="Fluency (WPM)" />
        </LineChart>
      </ResponsiveContainer>
      <div className="key-container">
        <div className="key-item">
          <div className="key-color" style={{ backgroundColor: '#ff7300' }}></div>
          <span>Accuracy (%)</span>
        </div>
        <div className="key-item">
          <div className="key-color" style={{ backgroundColor: '#4caf50' }}></div>
          <span>Fluency (WPM)</span>
        </div>
      </div>
      {chartData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default OverallAccuracyFluencyChart;