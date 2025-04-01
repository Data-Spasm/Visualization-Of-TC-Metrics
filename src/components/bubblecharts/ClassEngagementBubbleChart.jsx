import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import "./ClassEngagementBubbleChart.css";

const colorPalette = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#6366f1", "#ec4899", "#22c55e", "#8b5cf6",
  "#14b8a6", "#f43f5e"
];

const ClassEngagementBubbleChart = ({
  readingAttempts = [],
  assessments = [],
  students = []
}) => {
  const [seriesData, setSeriesData] = useState([]);
  const [storySummary, setStorySummary] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!readingAttempts.length || !assessments.length || !students.length) return;

    const passageMap = new Map();
    const passageDataMap = {};
    let passageCounter = 1;

    readingAttempts.forEach((attempt) => {
      const assessment = assessments.find(
        (a) => (a._id?.$oid || a._id) === attempt.readingAssessmentId
      );
      const title = assessment?.readingContent?.readingMaterial?.passageTitle || "Untitled";

      if (!passageMap.has(title)) {
        passageMap.set(title, `P${passageCounter++}`);
      }

      const passageId = passageMap.get(title);
      const username = attempt.studentUsername;
      const displayStudent = students.find((s) => s.username === username);
      const displayName = displayStudent
        ? `${displayStudent.firstName} ${displayStudent.lastName}`
        : username;

      const assessmentId = attempt.readingAssessmentId;
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

      const existing = passageDataMap[title].data.find((d) => d.username === username);
      if (existing) {
        existing.y += 1;
        existing.z += time;
      } else {
        passageDataMap[title].data.push({
          x: parseInt(passageId.replace("P", "")) + passageDataMap[title].data.length * 0.2,
          y: 1,
          z: time,
          name: displayName,
          username, // for routing
          passageId: assessmentId
        });
      }

      passageDataMap[title].totalAttempts += 1;
      passageDataMap[title].totalTime += time;
    });

    const allData = Object.values(passageDataMap);
    setSeriesData(allData);

    const mostEngaged = [...allData].sort((a, b) => b.totalAttempts - a.totalAttempts)[0];
    if (mostEngaged) {
      setStorySummary(
        `Students interacted the most with "${mostEngaged.name}", with ${mostEngaged.totalAttempts} total attempts and a combined ${mostEngaged.totalTime} seconds spent.`
      );
    } else {
      setStorySummary("No engagement data available for analysis.");
    }
  }, [readingAttempts, assessments, students]);

  const chartOptions = {
    chart: {
      type: "bubble",
      toolbar: { show: false },
      zoom: { enabled: false },
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const { seriesIndex, dataPointIndex } = config;
          const bubble = chartContext.w.config.series[seriesIndex].data[dataPointIndex];
          if (bubble?.username && bubble?.passageId) {
            navigate(`/passages/${bubble.username}/${bubble.passageId}`);
          }
        }
      }
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
            Time on Task: ${dp.z} sec<br/>
            <em>Click to view attempt</em>
          </div>
        `;
      }
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.25 },
    colors: seriesData.map((s) => s.color),
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
        bottom: 30,
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

      <div style={{ width: "100%", height: 390 }}>
        <Chart options={chartOptions} series={seriesData} type="bubble" height="100%" />
      </div>

      {seriesData.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> Click a bubble to view the student's specific passage attempt.
        </div>
      )}

      {seriesData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default ClassEngagementBubbleChart;
