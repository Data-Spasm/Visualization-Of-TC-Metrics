import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import "./ClassEngagementBubbleChart.css";

// This component visualizes student engagement with reading passages using a bubble chart.
const colorPalette = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#6366f1", "#ec4899", "#22c55e", "#8b5cf6",
  "#14b8a6", "#f43f5e"
];

// The StudentEngagementBubbleChart component takes in reading attempts and assessments as props and generates a bubble chart to visualize student engagement with reading passages.
const StudentEngagementBubbleChart = ({ student, readingAttempts = [], assessments = [] }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [legendMap, setLegendMap] = useState([]);
  const [storySummary, setStorySummary] = useState("");
  const [chartAnnotations, setChartAnnotations] = useState({});
  const navigate = useNavigate(); // Needed for routing to attempt page

  const processStudentAttempts = () => {
    if (!student || !readingAttempts.length || !assessments.length) return;

    const studentAttempts = readingAttempts.filter(a => a.studentUsername === student.username);
    const passageMap = new Map();
    const seenPassages = {};
    let passageCounter = 1;

    studentAttempts.forEach(attempt => {
      const id = attempt.readingAssessmentId;
      const assessment = assessments.find(a => (a._id?.$oid || a._id) === id);
      const title = assessment?.readingContent?.readingMaterial?.passageTitle || `Passage ${passageCounter}`;

      if (!passageMap.has(title)) {
        passageMap.set(title, passageCounter++);
      }

      const x = passageMap.get(title);
      const y = Math.round(parseFloat(attempt.timeOnTask || 0));
      const z = Math.max(10, Math.min(80, y / 2));

      if (!seenPassages[title]) {
        seenPassages[title] = {
          name: `P${x} - ${title}`,
          data: [],
          color: colorPalette[(x - 1) % colorPalette.length],
          maxTime: 0,
          maxPoint: null,
          passageIndex: x
        };
      }

      seenPassages[title].data.push({
        x,
        y,
        z,
        passageId: id // used for routing
      });

      if (y > seenPassages[title].maxTime) {
        seenPassages[title].maxTime = y;
        seenPassages[title].maxPoint = { x, y };
      }
    });

    const allSeries = Object.values(seenPassages);
    setSeriesData(allSeries);

    const legend = Array.from(passageMap.entries()).map(([title, index]) => ({
      label: `P${index} - ${title}`,
      color: colorPalette[(index - 1) % colorPalette.length]
    }));
    setLegendMap(legend);

    const topPassage = allSeries.reduce((prev, current) =>
      current.maxTime > prev.maxTime ? current : prev
    , { maxTime: 0 });

    if (topPassage && topPassage.maxPoint) {
      setStorySummary(` ${student.firstName} spent the most time on "${topPassage.name}" (${topPassage.maxTime} seconds).`);

      setChartAnnotations({
        annotations: {
          points: [
            {
              x: topPassage.maxPoint.x,
              y: topPassage.maxPoint.y,
              marker: { size: 0 },
              label: {
                borderColor: "#f97316",
                offsetY: -15,
                style: {
                  color: "#fff",
                  background: "#f97316",
                  fontSize: "11px",
                },
                text: "⬆ Longest Time Spent"
              }
            }
          ]
        }
      });
    } else {
      setStorySummary(`No engagement data available for ${student.name}.`);
    }
  };

  useEffect(() => {
    processStudentAttempts();
  }, [student, readingAttempts, assessments]);

  const chartOptions = {
    chart: {
      type: "bubble",
      height: 500,
      toolbar: { show: false },
      zoom: { enabled: false },
      events: {
        // Handle bubble click to route to passage attempt
        dataPointSelection: function (event, chartContext, config) {
          const { seriesIndex, dataPointIndex } = config;
          const dp = chartContext.w.config.series[seriesIndex].data[dataPointIndex];
          if (dp && dp.passageId) {
            navigate(`/passages/${student.username}/${dp.passageId}`);
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
      title: { text: "Time on Task (Seconds)", style: { fontWeight: "normal" } },
      labels: { style: { fontSize: "12px" } }
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dp = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div style="padding: 5px;">
            <strong>${w.config.series[seriesIndex].name}</strong><br/>
            Time on Task: ${dp.y}s<br/>
            <em>Click to view attempt</em>
          </div>
        `;
      }
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.25 },
    colors: seriesData.map(s => s.color),
    ...chartAnnotations
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Student Engagement with Reading Passages</h3>

      <div className="story-summary">
        <p>{storySummary}</p>
      </div>

      <ResponsiveContainer width="100%" height={440}>
        <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
      </ResponsiveContainer>

      {seriesData.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> Longer times may reflect difficulty or careful reading. Consider comparing this with fluency or accuracy data.
        </div>
      )}

      {seriesData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default StudentEngagementBubbleChart;
