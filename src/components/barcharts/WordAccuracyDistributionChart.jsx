// We decided not to use this card

import React, { useEffect, useState } from "react";
import {  BarChart,  Bar,  XAxis,  YAxis,  Tooltip,  ResponsiveContainer,  CartesianGrid,  Cell,  PieChart,  Pie,  Label,  Legend,  Sector} from "recharts";
import "./WordAccuracyDistributionChart.css";

const getColor = (value, isStudent = true, index = 0) => {
  if (isStudent) {
    if (value <= 50) return "red";
    if (value <= 100) return "orange";
    if (value <= 150) return "yellow";
    if (value <= 200) return "green";
    return "blue";
  } else {
    // Match exact bin label ranges
    if (typeof value === "string") {
      if (value.startsWith("0-")) return "red";
      if (value.startsWith("310-")) return "orange";
      if (value.startsWith("620-")) return "yellow";
      if (value.startsWith("930-")) return "green";
      if (value.startsWith("1240-")) return "blue";
    }

    // fallback
    const colors = ["red", "orange", "yellow", "green", "blue"];
    return colors[index % colors.length];
  }
};

const WordAccuracyDistributionChart = ({ student, students }) => {
  const [processedData, setProcessedData] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (student && Array.isArray(student.student?.reading?.miscueResults)) {
      const studentData = student.student.reading.miscueResults.map((entry, index) => ({
        passage: entry.passageTitle || `Passage ${index + 1}`,
        correctWords: entry.numCorrect || 0,
      }));
      setProcessedData(studentData);
    } else if (!student && Array.isArray(students)) {
      const overallCorrectValues = students.map(s => s.student?.reading?.overallPerformance?.overallCorrect || 0);
      const maxCorrect = Math.max(...overallCorrectValues);
      const binCount = 5;
      const binSize = Math.ceil(maxCorrect / binCount);
      const bins = Array.from({ length: binCount }, (_, i) => i * binSize);
      const binLabels = bins.map((bin, index) => `${bin}-${bin + binSize - 1}`);
      const classData = bins.map((bin, index) => ({
        name: binLabels[index],
        value: students.filter(s => {
          const val = s.student?.reading?.overallPerformance?.overallCorrect || 0;
          return val >= bin && val < (bins[index + 1] || Infinity);
        }).length
      })).filter(entry => entry.value > 0);
      setTotal(classData.reduce((sum, item) => sum + item.value, 0));
      setProcessedData(classData);
    }
  }, [student, students]);

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
        {student ? `${student.firstName}'s Correct Words per Passage` : "Class Word Accuracy Distribution"}
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
            <Tooltip formatter={(value) => [`${value} correct words`, "Correct Words"]} />
            <Bar dataKey="correctWords" barSize={40}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.correctWords)} />
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
                  fill={getColor(entry.name, false, index)}
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
