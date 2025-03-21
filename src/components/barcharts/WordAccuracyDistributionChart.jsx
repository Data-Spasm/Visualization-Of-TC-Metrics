import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import "./WordAccuracyDistributionChart.css";

// Function to calculate dynamic bins based on the range of overallCorrect values
const calculateBins = (students, binCount = 5) => {
  const overallCorrectValues = students.map(student => student.student?.reading?.overallPerformance?.overallCorrect || 0);
  const maxCorrect = Math.max(...overallCorrectValues);
  const binSize = Math.ceil(maxCorrect / binCount);
  const bins = Array.from({ length: binCount }, (_, i) => i * binSize);
  const binLabels = bins.map((bin, index) => `${bin}-${bin + binSize - 1}`);
  return { bins, binLabels };
};

// Function to process class-wide data
const groupWordAccuracy = (students, bins, binLabels) => {
  return bins.map((bin, index) => ({
    range: binLabels[index],
    count: students.filter(student => 
      student.student?.reading?.overallPerformance?.overallCorrect >= bin &&
      student.student?.reading?.overallPerformance?.overallCorrect < (bins[index + 1] || Infinity)
    ).length
  }));
};

// Function to determine color based on range or correct words
const getColor = (value, isStudent, binLabels) => {
  if (isStudent) {
    if (value <= 50) return "red";
    if (value <= 100) return "orange";
    if (value <= 150) return "yellow";
    if (value <= 200) return "green";
    return "blue";
  } else {
    const index = binLabels.indexOf(value);
    const colors = ["red", "orange", "yellow", "green", "blue"];
    return colors[index % colors.length];
  }
};

// **Main Component**
const WordAccuracyDistributionChart = ({ students, student = null }) => {
  const [processedData, setProcessedData] = useState([]);
  const [bins, setBins] = useState([]);
  const [binLabels, setBinLabels] = useState([]);

  useEffect(() => {
    console.log("Processing data for Word Accuracy Chart...");

    if (student) {
      // Process data for **individual student**
      const studentData = student.student?.reading?.readingAssessmentViews.map((entry, index) => ({
        passage: `Passage ${index + 1}`,
        correctWords: entry.overallCorrect || 0,
        accuracy: entry.overallCorrect && entry.overallRefWords 
          ? (entry.overallCorrect / entry.overallRefWords) * 100 
          : 0, // Convert to percentage
      })) || [];

      console.log("Processed Individual Student Data:", studentData);
      setProcessedData(studentData);
    } else {
      // Calculate dynamic bins
      const { bins, binLabels } = calculateBins(students);
      setBins(bins);
      setBinLabels(binLabels);

      // Process data for **class-wide** distribution
      const classData = groupWordAccuracy(students, bins, binLabels);
      console.log("Processed Class-Wide Data:", classData);
      setProcessedData(classData);
    }
  }, [student, students]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {student ? `${student.firstName}'s Word Accuracy` : "Word Accuracy Distribution"}
      </h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={student ? "passage" : "range"} 
            label={{ value: student ? "Passages" : "Correct Words", position: "insideBottom", offset: -5 }} 
          />
          <YAxis 
            label={{ value: student ? "Correct Words" : "Number of Students", angle: -90, position: "insideLeft" }} 
            allowDecimals={false} 
            domain={[0, "auto"]} 
          />
          <Tooltip 
            formatter={(value, name, props) => {
              if (student) return [`Accuracy: ${props.payload.accuracy.toFixed(1)}%`, "Correct Words"];
              return [value, "Number of Students"];
            }}
          />
          <Bar dataKey={student ? "correctWords" : "count"} barSize={40}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}-${entry.range || entry.passage}`} fill={getColor(student ? entry.correctWords : entry.range, !!student, binLabels)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WordAccuracyDistributionChart;