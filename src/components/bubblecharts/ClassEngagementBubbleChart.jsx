import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ResponsiveContainer } from "recharts";
import "./ClassEngagementBubbleChart.css";

// This component visualizes class engagement with reading passages using a bubble chart.
const colorPalette = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#6366f1", "#ec4899", "#22c55e", "#8b5cf6",
  "#14b8a6", "#f43f5e"
];

// The ClassEngagementBubbleChart component takes in reading attempts and assessments as props and generates a bubble chart to visualize student engagement with reading passages.
const ClassEngagementBubbleChart = ({ readingAttempts = [], assessments = [] }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [storySummary, setStorySummary] = useState("");

  useEffect(() => {
    if (!readingAttempts.length || !assessments.length) return;

    const passageMap = new Map();
    const passageDataMap = {};
    let passageCounter = 1;

    readingAttempts.forEach((attempt) => {
      const assessment = assessments.find(
        a => (a._id?.$oid || a._id) === attempt.readingAssessmentId
      );
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
          totalAttempts: 0,
          totalTime: 0
        };
      }

      const studentEntry = passageDataMap[title].data.find(d => d.name === studentName);
      if (studentEntry) {
        studentEntry.y += 1;
        studentEntry.z += time;
      } else {
        passageDataMap[title].data.push({
          x: parseInt(passageId.replace("P", "")) + passageDataMap[title].data.length * 0.2,
          y: 1,
          z: time,
          name: studentName,
          passageId
        });
      }

      passageDataMap[title].totalAttempts += 1;
      passageDataMap[title].totalTime += time;
    });

    const allData = Object.values(passageDataMap);
    setSeriesData(allData);

    // Data storytelling summary
    const mostEngaged = [...allData].sort((a, b) => b.totalAttempts - a.totalAttempts)[0];
    if (mostEngaged) {
      setStorySummary(
        `Students interacted the most with "${mostEngaged.name}", with ${mostEngaged.totalAttempts} total attempts and a combined ${mostEngaged.totalTime} seconds spent.`
      );
    } else {
      setStorySummary("No engagement data available for analysis.");
    }
  }, [readingAttempts, assessments]);

  const chartOptions = {
    chart: {
      type: "bubble",
      // Let height be controlled by container
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      title: { text: "Passages", style: { fontWeight: "normal" } },
      tickAmount: 10,
      labels: {
        formatter: val => `P${Math.round(val)}`,
        style: { fontSize: "12px" }
      }
    },
    yaxis: {
      title: { text: "Number of Attempts", style: { fontWeight: "normal" } },
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
      horizontalAlign: "center",
      fontSize: "10px",
      itemMargin: { horizontal: 10, vertical: 2 },
      markers: { width: 10, height: 10 }
    },
    plotOptions: {
      bubble: {
        minBubbleRadius: 5,
        maxBubbleRadius: 50,
        padding: 5
      }
    },
    grid: {
      padding: {
        bottom: 30, // Ensure legend doesn't crowd the chart
        top: 10,
        left: 10,
        right: 10
      }
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Class Engagement with Reading Passages</h3>

      <div className="story-summary">
        <p>{storySummary}</p>
      </div>

      <ResponsiveContainer width="100%" height={355}>
        <Chart options={chartOptions} series={seriesData} type="bubble" />
      </ResponsiveContainer>

      {seriesData.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> Passages with large bubbles and high attempt counts may indicate either student interest or reading difficulty—consider reviewing performance data for those passages.
        </div>
      )}

      {seriesData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default ClassEngagementBubbleChart;
