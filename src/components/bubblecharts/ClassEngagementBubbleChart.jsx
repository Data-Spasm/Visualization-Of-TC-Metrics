import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./ClassEngagementBubbleChart.css";

const ClassEngagementBubbleChart = ({ readingAttempts }) => {
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    const mockData = [
      { passageTitle: "Passage 1", attempts: [{} , {} , {}] },
      { passageTitle: "Passage 2", attempts: [{} , {} , {} , {} , {}] },
      { passageTitle: "Passage 3", attempts: [{}] },
      { passageTitle: "Passage 4", attempts: [{} , {} , {} , {} , {} , {} , {} , {}] },
      { passageTitle: "Passage 5", attempts: [{} , {}] }
    ];

    const dataToUse = readingAttempts && readingAttempts.length > 0 ? readingAttempts : mockData;

    const passageMapping = {
      "Passage 1": 10,
      "Passage 2": 30,
      "Passage 3": 50,
      "Passage 4": 70,
      "Passage 5": 90
    };

    const engagement = Object.keys(passageMapping).map(passageTitle => {
      const attempts = dataToUse.find(item => item.passageTitle === passageTitle)?.attempts || [];
      const attemptFrequency = attempts.length;

      return {
        name: passageTitle,
        data: [{
          x: passageMapping[passageTitle],
          y: attemptFrequency, //Use frequency as y-axis value
          z: Math.sqrt(attemptFrequency) * 10 //Bubble size scales with attempt frequency
        }]
      };
    });

    setEngagementData(engagement);
  }, [readingAttempts]);

  const chartOptions = {
    chart: {
      type: "bubble",
      height: 400,
      toolbar: { show: false }
    },
    xaxis: {
      labels: {
        style: { fontSize: "12px" },
        formatter: (val) => {
          if (val < 20) return "Passage 1";
          if (val < 40) return "Passage 2";
          if (val < 60) return "Passage 3";
          if (val < 80) return "Passage 4";
          return "Passage 5";
        },
      },
      tickAmount: 4,
    },
    yaxis: {
      title: {
        text: "Number of Attempts",
        style: { fontSize: "14px", fontWeight: "normal" },
      },
      labels: {
        style: { fontSize: "12px" },
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const passageTitle = w.globals.seriesNames[seriesIndex];
        const numberOfAttempts = series[seriesIndex][dataPointIndex];
        return `<div style="padding: 5px;">${passageTitle}<br/>Number of Attempts: ${numberOfAttempts}</div>`;
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"],
  };

  return (
    <div className="chart-card grey-background">
      <div className="chart-title">Class Engagement with Reading Passages</div>
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

export default ClassEngagementBubbleChart;
