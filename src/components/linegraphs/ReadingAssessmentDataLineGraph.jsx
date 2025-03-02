import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './ReadingAssessmentDataLineGraph.css'

const ReadingAssessmentDataLineGraph = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="number" label={{ value: 'Number of Passages', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '12px',
              padding: '5px'
            }}
            itemStyle={{
              color: '#333'
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px'
            }}
          />
          <Line
            type="monotone"
            dataKey="passagesPlayed"
            stroke="#f4a261"
            name="Passages Played"
          />
          <Line
            type="monotone"
            dataKey="passagesFinished"
            stroke="#2a9d8f"
            name="Passages Finished"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReadingAssessmentDataLineGraph
