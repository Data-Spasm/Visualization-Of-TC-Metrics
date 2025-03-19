import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./ClassEngagementBubbleChart.css";

const passageColors = {
  "Passage 1": "rgba(255, 87, 51, 0.3)",
  "Passage 2": "rgba(51, 255, 87, 0.3)",
  "Passage 3": "rgba(51, 87, 255, 0.3)",
  "Passage 4": "rgba(255, 51, 161, 0.3)",
  "Passage 5": "rgba(161, 51, 255, 0.3)"
};

const StudentEngagementBubbleChart = ({ readingAttempts, studentName = "Student 1" }) => {
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    const allData = readingAttempts && readingAttempts.length > 0 ? readingAttempts : [
      { passageTitle: "Passage 1", student: "Student 1", timeOnTask: 120 },
      { passageTitle: "Passage 1", student: "Student 1", timeOnTask: 120 },
      { passageTitle: "Passage 1", student: "Student 1", timeOnTask: 220 },
      { passageTitle: "Passage 2", student: "Student 1", timeOnTask: 100 },
      { passageTitle: "Passage 2", student: "Student 1", timeOnTask: 50 },
      { passageTitle: "Passage 2", student: "Student 1", timeOnTask: 50 },
      { passageTitle: "Passage 3", student: "Student 1", timeOnTask: 180 },
      { passageTitle: "Passage 3", student: "Student 1", timeOnTask: 220 },
      { passageTitle: "Passage 3", student: "Student 1", timeOnTask: 120 },
      { passageTitle: "Passage 3", student: "Student 1", timeOnTask: 70 },
      { passageTitle: "Passage 4", student: "Student 1", timeOnTask: 150 },
      { passageTitle: "Passage 4", student: "Student 1", timeOnTask: 100 },
      { passageTitle: "Passage 4", student: "Student 1", timeOnTask: 100 },
      { passageTitle: "Passage 5", student: "Student 1", timeOnTask: 60 },
      { passageTitle: "Passage 5", student: "Student 1", timeOnTask: 90 },
    ];

    const dataToUse = allData.filter(item => item.student === studentName);

    const passageMapping = {
      "Passage 1": 10,
      "Passage 2": 30,
      "Passage 3": 50,
      "Passage 4": 70,
      "Passage 5": 90
    };

    const groupedData = Object.keys(passageMapping).map((passage) => {
      let offsetMap = {};
      return {
        name: passage,
        data: dataToUse.filter(item => item.passageTitle === passage).map(item => {
          if (!offsetMap[item.timeOnTask]) offsetMap[item.timeOnTask] = 0;
          const xPosition = passageMapping[item.passageTitle] + offsetMap[item.timeOnTask];
          offsetMap[item.timeOnTask] += 3;

          return {
            x: xPosition,
            y: item.timeOnTask,
            z: Math.sqrt(item.timeOnTask) * 2, // Bubble size based on timeOnTask
            name: item.student,
            fillColor: passageColors[item.passageTitle]
          };
        })
      };
    });

    setEngagementData(groupedData);
  }, [readingAttempts, studentName]);

  const chartOptions = {
    chart: {
      type: "bubble",
      height: 400,
      toolbar: { show: false }
    },
    xaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val) => {
          if (val < 20) return "Passage 1";
          if (val < 40) return "Passage 2";
          if (val < 60) return "Passage 3";
          if (val < 80) return "Passage 4";
          return "Passage 5";
        },
        style: { fontSize: "12px" },
      },
      title: {
        text: "Passages",
        style: { fontSize: "14px", fontWeight: "normal" }
      }
    },
    yaxis: {
      title: {
        text: "Time on Task",
        style: { fontSize: "14px", fontWeight: "normal" }
      },
      labels: {
        style: { fontSize: "12px" }
      }
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Time on Task: ${Math.round(dataPoint.z)} seconds</div>`;
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: Object.values(passageColors)
  };

  return (
    <div className="chart-card grey-background">
      <div className="chart-title">Engagement for {studentName}</div>
      <Chart
        options={chartOptions}
        series={engagementData}
        type="bubble"
        height={400}
      />
      {engagementData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default StudentEngagementBubbleChart;
