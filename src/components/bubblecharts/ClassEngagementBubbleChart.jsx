import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./ClassEngagementBubbleChart.css";

const colorPalette = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#6366f1", "#ec4899", "#22c55e", "#8b5cf6",
  "#14b8a6", "#f43f5e"
];

const ClassEngagementBubbleChart = ({ readingAttempts = [], assessments = [] }) => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    if (!readingAttempts.length || !assessments.length) return;

    const passageMap = new Map(); // title => P#
    const passageDataMap = {}; // title => series

    let passageCounter = 1;

    readingAttempts.forEach((attempt) => {
      const assessment = assessments.find(a => (a._id?.$oid || a._id) === attempt.readingAssessmentId);
      const title = assessment?.readingContent?.readingMaterial?.passageTitle || "Untitled";

      if (!passageMap.has(title)) {
        passageMap.set(title, `P${passageCounter++}`);
      }

      const passageId = passageMap.get(title);
      const studentName = attempt.studentUsername;
      const time = Math.round(parseFloat(attempt.timeOnTask || 0));

      if (!passageDataMap[title]) {
        passageDataMap[title] = {
          name: `${passageId} - ${title}`,
          data: [],
          color: colorPalette[(passageCounter - 2) % colorPalette.length],
        };
      }

      const studentEntry = passageDataMap[title].data.find(d => d.name === studentName);
      if (studentEntry) {
        studentEntry.y += 1; // count attempts
        studentEntry.z += time; // sum time
      } else {
        passageDataMap[title].data.push({
          x: parseInt(passageId.replace("P", "")) + passageDataMap[title].data.length * 0.2,
          y: 1,
          z: time,
          name: studentName,
          passageId
        });
        
      }
    });

    setSeriesData(Object.values(passageDataMap));
  }, [readingAttempts, assessments]);

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
        formatter: val => `P${Math.round(val)}`, // Ensure integer values with "P" prefix
        style: { fontSize: "12px" }
      }
    },
    yaxis: {
      title: { text: "Number of Attempts" },
      labels: { style: { fontSize: "12px" } }
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dp = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div style="padding: 5px;">
            <strong>${w.config.series[seriesIndex].name}</strong><br/>
            Student: ${dp.name}<br/>
            Attempts: ${dp.y}<br/>
            Time on Task: ${dp.z} sec
          </div>
        `;
      }
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.25 },
    colors: seriesData.map(s => s.color),
    legend: {
      show: true,
      position: "bottom",
      fontSize: "10px"
    },
    plotOptions: {
      bubble: {
        minBubbleRadius: 5, // Minimum bubble size
        maxBubbleRadius: 50, // Maximum bubble size
        padding: 5 // Add padding to avoid overlapping
      }
    }
  };

  return (
    <div className="chart-card grey-background">
      <div className="chart-title">Class Engagement with Reading Passages</div>
      <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
      {seriesData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default ClassEngagementBubbleChart;