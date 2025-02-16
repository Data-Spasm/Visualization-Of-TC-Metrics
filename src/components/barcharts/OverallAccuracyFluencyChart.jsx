import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './OverallAccuracyFluencyChart.css'

const OverallAccuracyFluencyChart = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
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
          <Bar dataKey="passage1Accuracy" stackId="a" fill="#8884d8" name="Passage 1 Accuracy" />
          <Bar dataKey="passage1Fluency" stackId="a" fill="#82ca9d" name="Passage 1 Fluency" />
          <Bar dataKey="passage2Accuracy" stackId="b" fill="#ffc658" name="Passage 2 Accuracy" />
          <Bar dataKey="passage2Fluency" stackId="b" fill="#ff7300" name="Passage 2 Fluency" />
          <Bar dataKey="passage3Accuracy" stackId="c" fill="#d0ed57" name="Passage 3 Accuracy" />
          <Bar dataKey="passage3Fluency" stackId="c" fill="#a4de6c" name="Passage 3 Fluency" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OverallAccuracyFluencyChart