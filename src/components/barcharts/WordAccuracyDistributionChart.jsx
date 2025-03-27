import React, { useEffect, useState } from "react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Label, Legend, Sector} from "recharts";
import "./WordAccuracyDistributionChart.css";

// Function to calculate dynamic bins based on the range of overallCorrect values
const calculateBins = (students, binCount = 5) => {
  const overallCorrectValues = students.map(student =>
    student.student?.reading?.overallPerformance?.overallCorrect || 0);
  const maxCorrect = Math.max(...overallCorrectValues);
  const binSize = Math.ceil(maxCorrect / binCount);
  const bins = Array.from({ length: binCount }, (_, i) => i * binSize);
  const binLabels = bins.map((bin, index) => `${bin}-${bin + binSize - 1}`);
  return { bins, binLabels };
};

// Function to process class-wide data
const groupWordAccuracy = (students, bins, binLabels) => {
  return bins.map((bin, index) => ({
    name: binLabels[index],
    value: students.filter(student =>
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
  const [total, setTotal] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

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
      const classData = groupWordAccuracy(students, bins, binLabels).filter(entry => entry.value > 0);
      setTotal(classData.reduce((sum, item) => sum + item.value, 0));
      setProcessedData(classData);
    }
  }, [student, students]);

  // Custom render for active pie slice
  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
    } = props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    );
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {student ? `${student.firstName}'s Word Accuracy` : "Class Word Accuracy Distribution"}
      </h3>

      <ResponsiveContainer width="100%" height={420}>
        {student ? (
          <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="passage"
              label={{ value: "Passages", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{ value: "Correct Words", angle: -90, position: "insideLeft" }}
              allowDecimals={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value, name, props) =>
                [`Accuracy: ${props.payload.accuracy.toFixed(1)}%`, "Correct Words"]
              }
            />
            <Bar dataKey="correctWords" barSize={40}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.correctWords, true)} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart margin={{ top: 20, right: 40, bottom: 40, left: 40 }}>
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              cornerRadius={5}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              isAnimationActive={true}
              label={false}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={getColor(entry.name, false, binLabels)}
                />
              ))}
              <Label
                value={`Total: ${total}`}
                position="center"
                style={{ fontSize: 18, fontWeight: "bold", fill: "#333" }}
              />
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}`, "Students"]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#333" }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default WordAccuracyDistributionChart;
