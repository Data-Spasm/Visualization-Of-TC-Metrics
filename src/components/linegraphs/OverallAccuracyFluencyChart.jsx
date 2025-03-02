import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './OverallAccuracyFluencyChart.css';

const OverallAccuracyFluencyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  const formattedData = data.map((performance, index) => ({
    week: `Week ${index + 1}`,
    accuracy: performance.accuracy * 100,
    fluency: performance.fluency,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Overall Accuracy & Fluency Trend</h3>
      <ResponsiveContainer width="95%" height={350}>
        <LineChart
          data={formattedData}
          margin={{
            top: 20, right: 50, left: 50, bottom: 30,
          }}
        >
          {/* Background Grid */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          
          {/* Axis Settings */}
          <XAxis dataKey="week" tick={{ fontSize: 14, fill: '#333' }} />
          <YAxis 
            tick={{ fontSize: 14, fill: '#333' }}
            label={{ value: 'Performance Metrics', angle: -90, position: 'insideLeft', fontSize: 14 }}
          />
          
          {/* Tooltip Customization */}
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '13px',
              padding: '10px'
            }}
            itemStyle={{ color: '#555' }}
          />
          
          {/* Legend Styling - Move it to the bottom */}
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
          />
          
          {/* Curved Lines with Markers */}
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#ff7300" 
            strokeWidth={3} 
            dot={{ fill: '#ff7300', r: 6 }} 
            activeDot={{ r: 8 }}
            name="Accuracy (%)"
          />
          <Line 
            type="monotone" 
            dataKey="fluency" 
            stroke="#4caf50" 
            strokeWidth={3} 
            strokeDasharray="5 5"
            dot={{ fill: '#4caf50', r: 6 }} 
            activeDot={{ r: 8 }}
            name="Fluency (WPM)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallAccuracyFluencyChart;
