// import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import "./ClassEngagementBubbleChart.css";

// const passageColors = {
//   "Passage 1": "#FF5733",
//   "Passage 2": "#33FF57",
//   "Passage 3": "#3357FF",
//   "Passage 4": "#FF33A1",
//   "Passage 5": "#A133FF"
// };

// const ClassEngagementBubbleChart = ({ readingAttempts }) => {
//   const [engagementData, setEngagementData] = useState([]);

//   useEffect(() => {
//     const mockData = [
//       { passageTitle: "Passage 1", student: "Student 1", attempts: 3, timeOnTask: 120 },
//       { passageTitle: "Passage 1", student: "Student 2", attempts: 2, timeOnTask: 100 },
//       { passageTitle: "Passage 1", student: "Student 3", attempts: 1, timeOnTask: 110 },
//       { passageTitle: "Passage 1", student: "Student 4", attempts: 5, timeOnTask: 130 },
//       { passageTitle: "Passage 2", student: "Student 1", attempts: 3, timeOnTask: 140 },
//       { passageTitle: "Passage 2", student: "Student 2", attempts: 2, timeOnTask: 150 },
//       { passageTitle: "Passage 2", student: "Student 3", attempts: 1, timeOnTask: 160 },
//       { passageTitle: "Passage 2", student: "Student 4", attempts: 1, timeOnTask: 170 },
//       { passageTitle: "Passage 3", student: "Student 1", attempts: 2, timeOnTask: 180 },
//       { passageTitle: "Passage 3", student: "Student 2", attempts: 3, timeOnTask: 190 },
//       { passageTitle: "Passage 3", student: "Student 3", attempts: 4, timeOnTask: 200 },
//       { passageTitle: "Passage 3", student: "Student 4", attempts: 5, timeOnTask: 210 },
//       { passageTitle: "Passage 4", student: "Student 1", attempts: 4, timeOnTask: 220 },
//       { passageTitle: "Passage 4", student: "Student 2", attempts: 3, timeOnTask: 230 },
//       { passageTitle: "Passage 4", student: "Student 3", attempts: 2, timeOnTask: 240 },
//       { passageTitle: "Passage 4", student: "Student 4", attempts: 2, timeOnTask: 250 },
//       { passageTitle: "Passage 5", student: "Student 1", attempts: 1, timeOnTask: 260 },
//       { passageTitle: "Passage 5", student: "Student 2", attempts: 2, timeOnTask: 270 },
//       { passageTitle: "Passage 5", student: "Student 3", attempts: 4, timeOnTask: 280 },
//       { passageTitle: "Passage 5", student: "Student 4", attempts: 5, timeOnTask: 290 }
//     ];

//     const dataToUse = readingAttempts && readingAttempts.length > 0 ? readingAttempts : mockData;

//     const passageMapping = {
//       "Passage 1": 10,
//       "Passage 2": 30,
//       "Passage 3": 50,
//       "Passage 4": 70,
//       "Passage 5": 90
//     };

//     const groupedData = Object.keys(passageMapping).map((passage) => {
//       return {
//         name: passage,
//         data: dataToUse.filter(item => item.passageTitle === passage).map(item => ({
//           x: passageMapping[item.passageTitle],
//           y: item.attempts,
//           z: Math.sqrt(item.timeOnTask) * 2,
//           name: item.student
//         }))
//       };
//     });

//     setEngagementData(groupedData);
//   }, [readingAttempts]);

//   const chartOptions = {
//     chart: {
//       type: "bubble",
//       height: 400,
//       toolbar: { show: false }
//     },
//     xaxis: {
//       tickAmount: 4,
//       labels: {
//         formatter: (val) => {
//           if (val < 20) return "Passage 1";
//           if (val < 40) return "Passage 2";
//           if (val < 60) return "Passage 3";
//           if (val < 80) return "Passage 4";
//           return "Passage 5";
//         },
//         style: { fontSize: "12px" },
//       },
//       title: {
//         text: "Passages",
//         style: { fontSize: "14px", fontWeight: "normal" }
//       }
//     },
//     yaxis: {
//       title: {
//         text: "Number of Attempts",
//         style: { fontSize: "14px", fontWeight: "normal" }
//       },
//       labels: {
//         style: { fontSize: "12px" }
//       }
//     },
//     tooltip: {
//       enabled: true,
//       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
//         const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
//         return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Number of Attempts: ${dataPoint.y}<br/>Average Time on Task: ${Math.round(dataPoint.z)} minutes</div>`;
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     colors: Object.values(passageColors)
//   };

//   return (
//     <div className="chart-card grey-background">
//       <div className="chart-title">Class Engagement with Reading Passages</div>
//       <Chart
//         options={chartOptions}
//         series={engagementData}
//         type="bubble"
//         height={400}
//       />
//       {engagementData.length === 0 && <div className="no-data">No data available</div>}
//     </div>
//   );
// };

// export default ClassEngagementBubbleChart;

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

const ClassEngagementBubbleChart = ({ readingAttempts }) => {
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    const dataToUse = readingAttempts && readingAttempts.length > 0 ? readingAttempts : [
      { passageTitle: "Passage 1", student: "Student 1", attempts: 2, timeOnTask: 120 },
      { passageTitle: "Passage 1", student: "Student 2", attempts: 2, timeOnTask: 100 },
      { passageTitle: "Passage 1", student: "Student 3", attempts: 3, timeOnTask: 110 },
      { passageTitle: "Passage 1", student: "Student 4", attempts: 4, timeOnTask: 130 },
      { passageTitle: "Passage 2", student: "Student 1", attempts: 4, timeOnTask: 140 },
      { passageTitle: "Passage 2", student: "Student 2", attempts: 4, timeOnTask: 150 },
      { passageTitle: "Passage 2", student: "Student 3", attempts: 2, timeOnTask: 160 },
      { passageTitle: "Passage 2", student: "Student 4", attempts: 1, timeOnTask: 170 },
      { passageTitle: "Passage 3", student: "Student 1", attempts: 1, timeOnTask: 180 },
      { passageTitle: "Passage 3", student: "Student 2", attempts: 3, timeOnTask: 190 },
      { passageTitle: "Passage 3", student: "Student 3", attempts: 3, timeOnTask: 200 },
      { passageTitle: "Passage 3", student: "Student 4", attempts: 5, timeOnTask: 210 },
      { passageTitle: "Passage 4", student: "Student 1", attempts: 4, timeOnTask: 220 },
      { passageTitle: "Passage 4", student: "Student 2", attempts: 3, timeOnTask: 230 },
      { passageTitle: "Passage 4", student: "Student 3", attempts: 2, timeOnTask: 240 },
      { passageTitle: "Passage 4", student: "Student 4", attempts: 2, timeOnTask: 250 },
      { passageTitle: "Passage 5", student: "Student 1", attempts: 1, timeOnTask: 260 },
      { passageTitle: "Passage 5", student: "Student 2", attempts: 1, timeOnTask: 270 },
      { passageTitle: "Passage 5", student: "Student 3", attempts: 3, timeOnTask: 280 },
      { passageTitle: "Passage 5", student: "Student 4", attempts: 5, timeOnTask: 290 }
    ];

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
          if (!offsetMap[item.attempts]) offsetMap[item.attempts] = 0;
          const xPosition = passageMapping[item.passageTitle] + offsetMap[item.attempts];
          offsetMap[item.attempts] += 3;

          return {
            x: xPosition,
            y: item.attempts,
            z: Math.sqrt(item.timeOnTask) * 2,
            name: item.student,
            fillColor: passageColors[item.passageTitle]
          };
        })
      };
    });

    setEngagementData(groupedData);
  }, [readingAttempts]);

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
        text: "Number of Attempts",
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
        return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Number of Attempts: ${dataPoint.y}<br/>Average Time on Task: ${Math.round(dataPoint.z)} seconds</div>`;
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: Object.values(passageColors)
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
