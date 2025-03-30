import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./ClassEngagementBubbleChart.css";

const colorPalette = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#6366f1", "#ec4899", "#22c55e", "#8b5cf6",
  "#14b8a6", "#f43f5e"
];

const StudentEngagementBubbleChart = ({ student, readingAttempts = [], assessments = [] }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [legendMap, setLegendMap] = useState([]);

  // Helper function to process student attempts
  const processStudentAttempts = () => {
    if (!student || !readingAttempts.length || !assessments.length) return;

    const studentAttempts = readingAttempts.filter(a => a.studentUsername === student.username);
    const passageMap = new Map(); // Maps passage titles to indices
    const seenPassages = {};
    let passageCounter = 1;

    studentAttempts.forEach(attempt => {
      const id = attempt.readingAssessmentId;
      const assessment = assessments.find(a => (a._id?.$oid || a._id) === id);
      const title = assessment?.readingContent?.readingMaterial?.passageTitle || `Passage ${passageCounter}`;

      if (!passageMap.has(title)) {
        passageMap.set(title, passageCounter++);
      }

      const x = passageMap.get(title); // Integer index
      const y = Math.round(parseFloat(attempt.timeOnTask || 0));
      const z = Math.max(10, Math.min(80, y / 2)); // Bubble size scaled

      if (!seenPassages[title]) {
        seenPassages[title] = {
          name: `P${x} - ${title}`,
          data: [],
          color: colorPalette[(x - 1) % colorPalette.length],
        };
      }

      seenPassages[title].data.push({ x, y, z });
    });

    setSeriesData(Object.values(seenPassages));

    const legend = Array.from(passageMap.entries()).map(([title, index]) => ({
      label: `P${index} - ${title}`,
      color: colorPalette[(index - 1) % colorPalette.length]
    }));

    setLegendMap(legend);
  };

  useEffect(() => {
    processStudentAttempts();
  }, [student, readingAttempts, assessments]);

  const chartOptions = {
    chart: {
      type: "bubble",
      height: 500,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      title: { text: "Passages" },
      tickAmount: 10,
      labels: {
        formatter: val => `P${Math.round(val)}`, // Ensure integer values
        style: { fontSize: "12px" }
      }
    },
    yaxis: {
      title: { text: "Time on Task (Seconds)" },
      labels: { style: { fontSize: "12px" } }
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dp = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div style="padding: 5px;">
            <strong>${w.config.series[seriesIndex].name}</strong><br/>
            Time on Task: ${dp.y}s
          </div>
        `;
      }
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.25 },
    colors: seriesData.map(s => s.color),
  };

  return (
    <div className="chart-card grey-background">
      <div className="chart-title">Student Engagement with Reading Passages</div>
      <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
    </div>
  );
};

export default StudentEngagementBubbleChart;