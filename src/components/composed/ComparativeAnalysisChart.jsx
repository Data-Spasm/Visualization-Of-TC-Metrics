import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Typography, Select, MenuItem } from "@mui/material";
import "./ComparativeAnalysisChart.css";

// This component is used to compare the performance of a selected student against the class average
const ComparativePerformanceChart = ({ miscues = [], students = [] }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [story, setStory] = useState("");

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0].username);
    }
  }, [students]);

  useEffect(() => {
    if (!selectedStudent) return;
    const filtered = miscues.filter(entry => entry.username === selectedStudent);

    // Group by passage to get 1 unique attempt per assessment per student
    const uniqueByPassage = new Map();
    for (const entry of filtered) {
      if (!uniqueByPassage.has(entry.passage)) {
        uniqueByPassage.set(entry.passage, entry);
      } else {
        const current = uniqueByPassage.get(entry.passage);
        current.numCorrect += entry.numCorrect || 0;
        current.numDels += entry.numDels || 0;
        current.numSubs += entry.numSubs || 0;
      }
    }

    setFilteredData(Array.from(uniqueByPassage.values()));
  }, [selectedStudent, miscues]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const highestMiscue = [...filteredData].sort((a, b) => {
        const totalA = (a.numCorrect || 0) + (a.numDels || 0) + (a.numSubs || 0);
        const rateA = totalA ? ((a.numDels + a.numSubs) / totalA) * 100 : 0;

        const totalB = (b.numCorrect || 0) + (b.numDels || 0) + (b.numSubs || 0);
        const rateB = totalB ? ((b.numDels + b.numSubs) / totalB) * 100 : 0;

        return rateB - rateA;
      })[0];

      const student = students.find(s => s.username === selectedStudent);
      if (highestMiscue && student) {
        const totalAttempts = highestMiscue.studentAttempts || 0;
        const classParticipation = highestMiscue.classAttempts || 0;
        setStory(
          `${student.firstName} ${student.lastName} showed the greatest difficulty in the passage titled "${highestMiscue.passage}". Out of ${totalAttempts} personal attempt${totalAttempts !== 1 ? 's' : ''}, their miscue rate reached ${(
            ((highestMiscue.numDels + highestMiscue.numSubs) /
              ((highestMiscue.numCorrect || 0) + (highestMiscue.numDels || 0) + (highestMiscue.numSubs || 0))) *
            100
          ).toFixed(1)}%. This compares with the class average performance based on ${classParticipation} attempt${classParticipation !== 1 ? 's' : ''}. This insight highlights a potential focal point for tailored reading support.`
        );
      }
    } else {
      setStory("No performance summary available yet.");
    }
  }, [filteredData, students, selectedStudent]);

  const mergedData = filteredData.map((entry) => {
    const total = (entry.numCorrect || 0) + (entry.numDels || 0) + (entry.numSubs || 0);
    const miscueRate = total > 0
      ? (((entry.numDels || 0) + (entry.numSubs || 0)) / total) * 100
      : 0;

    return {
      passage: entry.passage,
      studentCorrect: entry.numCorrect || 0,
      studentAttempts: entry.studentAttempts || 0,
      classCorrect: entry.avgCorrect || 0,
      classAttempts: entry.classAttempts || 0,
      miscueRate: +miscueRate.toFixed(2),
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length > 0) {
      const entry = payload[0].payload;

      return (
        <div style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: 6,
          maxWidth: 260
        }}>
          <strong>{label}</strong>
          <p style={{ color: "#3b82f6", margin: 0 }}>Student Correct: {entry.studentCorrect}</p>
          <p style={{ color: "#10b981", margin: 0 }}>Class Average: {entry.classCorrect.toFixed(2)}</p>
          <p style={{ color: "#ef4444", margin: 0 }}>Miscue Rate: {entry.miscueRate}%</p>
          <p style={{ marginTop: 4, fontStyle: "italic", fontSize: "12px", color: "#666" }}>
            Based on {entry.classAttempts} class attempt{entry.classAttempts !== 1 ? 's' : ''}<br />
            and {entry.studentAttempts} student attempt{entry.studentAttempts !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="comparative-card">
      <div style={{ marginBottom: "1rem" }}>
        <Typography variant="subtitle1">Select a Student</Typography>
        <Select fullWidth value={selectedStudent || ""} onChange={(e) => setSelectedStudent(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>Select Student</MenuItem>
          {students.map((s) => (
            <MenuItem key={s.username} value={s.username}>
              {s.firstName} {s.lastName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="story-summary">
        <p>{story}</p>
      </div>

      <div className="comparative-chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={mergedData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="passage" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: 'Correct Words', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Miscue Rate (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="studentCorrect" name="Student Correct" fill="#3b82f6" />
            <Bar yAxisId="left" dataKey="classCorrect" name="Class Average" fill="#10b981" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="miscueRate"
              name="Miscue Rate (%)"
              stroke="#ef4444"
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {mergedData.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> If a student's miscue rate is consistently high across multiple passages, consider revisiting decoding strategies or offering scaffolded fluency practice for those reading materials.
        </div>
      )}

      {mergedData.length === 0 && (
        <div className="no-data">No data available</div>
      )}
    </div>
  );
};

export default ComparativePerformanceChart;