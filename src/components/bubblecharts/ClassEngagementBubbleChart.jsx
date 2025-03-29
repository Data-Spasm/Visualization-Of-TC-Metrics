// // // import React, { useEffect, useState } from "react";
// // // import Chart from "react-apexcharts";
// // // import "./ClassEngagementBubbleChart.css";

// // // const ClassEngagementBubbleChart = ({ readingAttempts = [], assessments = [] }) => {
// // //   const [engagementData, setEngagementData] = useState([]);
// // //   const [passageData, setPassageData] = useState([]);

// // //   useEffect(() => {
// // //     if (!readingAttempts.length || !assessments.length) {
// // //       setEngagementData([]);
// // //       setPassageData([]);
// // //       return;
// // //     }

// // //     const passageMap = new Map();
// // //     const titleMap = {};

// // //     readingAttempts.forEach((attempt) => {
// // //       const assessment = assessments.find(a => a._id?.$oid === attempt.readingAssessmentId);
// // //       if (!assessment) return;
// // //       const title = assessment.title || "Untitled";

// // //       if (!passageMap.has(title)) {
// // //         passageMap.set(title, { id: `P${passageMap.size + 1}`, title, color: `#${Math.floor(Math.random()*16777215).toString(16)}` });
// // //       }
// // //       const passage = passageMap.get(title);

// // //       if (!titleMap[title]) {
// // //         titleMap[title] = { name: title, data: [] };
// // //       }

// // //       titleMap[title].data.push({
// // //         x: passageMap.size,
// // //         y: attempt.readingAttempts.length,
// // //         z: Math.round(attempt.timeOnTask),
// // //         name: attempt.studentUsername,
// // //         passageId: passage.id,
// // //         color: passage.color
// // //       });
// // //     });

// // //     setPassageData(Array.from(passageMap.values()));
// // //     setEngagementData(Object.values(titleMap));
// // //   }, [readingAttempts, assessments]);

// // //   const seriesData = passageData.map((passage, index) => ({
// // //     name: `${passage.id} - ${passage.title}`,
// // //     data: (engagementData.find(d => d.name === passage.title)?.data || []).map(d => ({
// // //       x: index + 1,
// // //       y: d.y,
// // //       z: d.z,
// // //       name: d.name,
// // //       passageId: d.passageId,
// // //       backgroundColor: passage.color
// // //     }))
// // //   }));

// // //   const chartOptions = {
// // //     chart: { type: "bubble", height: 500, toolbar: { show: false } },
// // //     xaxis: {
// // //       title: { text: "Passages", style: { fontSize: "14px", fontWeight: "normal" } },
// // //       categories: passageData.map(p => p.id),
// // //       labels: { style: { fontSize: "12px" } }
// // //     },
// // //     yaxis: {
// // //       title: { text: "Number of Attempts", style: { fontSize: "14px", fontWeight: "normal" } },
// // //       labels: { style: { fontSize: "12px" } }
// // //     },
// // //     legend: {
// // //       show: true,
// // //       position: "bottom",
// // //       fontSize: "10px",
// // //       itemMargin: { horizontal: 5, vertical: 2 }
// // //     },
// // //     tooltip: {
// // //       enabled: true,
// // //       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
// // //         const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
// // //         return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Passage ID: ${dataPoint.passageId}<br/>Attempts: ${dataPoint.y}<br/>Time on Task: ${dataPoint.z} sec</div>`;
// // //       }
// // //     },
// // //     dataLabels: { enabled: false }
// // //   };

// // //   return (
// // //     <div className="chart-card grey-background">
// // //       <div className="chart-title">Class Engagement with Reading Passages</div>
// // //       <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
// // //       {engagementData.length === 0 && <div className="no-data">No data available</div>}
// // //     </div>
// // //   );
// // // };

// // // export default ClassEngagementBubbleChart;

// // import React, { useEffect, useState } from "react";
// // import Chart from "react-apexcharts";
// // import "./ClassEngagementBubbleChart.css";

// // const ClassEngagementBubbleChart = ({ readingAttempts = [], assessments = [] }) => {
// //   const [engagementData, setEngagementData] = useState([]);
// //   const [passageData, setPassageData] = useState([]);

// //   useEffect(() => {
// //     if (!readingAttempts.length || !assessments.length) {
// //       setEngagementData([]);
// //       setPassageData([]);
// //       return;
// //     }

// //     const passageMap = new Map();
// //     const titleMap = {};

// //     readingAttempts.forEach((attempt) => {
// //       const assessment = assessments.find(a => a._id?.$oid === attempt.readingAssessmentId);
// //       if (!assessment) return;
// //       const title = assessment.title || "Untitled";

// //       if (!passageMap.has(title)) {
// //         passageMap.set(title, { id: `P${passageMap.size + 1}`, title, color: `#${Math.floor(Math.random()*16777215).toString(16)}` });
// //       }
// //       const passage = passageMap.get(title);

// //       if (!titleMap[title]) {
// //         titleMap[title] = { name: title, data: [] };
// //       }

// //       titleMap[title].data.push({
// //         x: passageMap.size,
// //         y: attempt.readingAttempts.length,
// //         z: Math.round(attempt.timeOnTask),
// //         name: attempt.studentUsername,
// //         passageId: passage.id,
// //         color: passage.color
// //       });
// //     });

// //     setPassageData(Array.from(passageMap.values()));
// //     setEngagementData(Object.values(titleMap));
// //   }, [readingAttempts, assessments]);

// //   const seriesData = passageData.map((passage, index) => ({
// //     name: `${passage.id} - ${passage.title}`,
// //     data: (engagementData.find(d => d.name === passage.title)?.data || []).map(d => ({
// //       x: index + 1,
// //       y: d.y,
// //       z: d.z,
// //       name: d.name,
// //       passageId: d.passageId,
// //       backgroundColor: passage.color
// //     }))
// //   }));

// //   const chartOptions = {
// //     chart: { 
// //       type: "bubble", 
// //       height: 500, 
// //       toolbar: { show: false }, // Disable zoom
// //       zoom: { enabled: false }
// //     },
// //     xaxis: {
// //       title: { text: "Passages", style: { fontSize: "14px", fontWeight: "normal" } },
// //       categories: passageData.map(p => p.id),
// //       labels: { style: { fontSize: "12px" } }
// //     },
// //     yaxis: {
// //       title: { text: "Number of Attempts", style: { fontSize: "14px", fontWeight: "normal" } },
// //       labels: { style: { fontSize: "12px" } }
// //     },
// //     legend: {
// //       show: true,
// //       position: "bottom",
// //       fontSize: "10px",
// //       itemMargin: { horizontal: 5, vertical: 2 }
// //     },
// //     tooltip: {
// //       enabled: true,
// //       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
// //         const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
// //         return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Passage ID: ${dataPoint.passageId}<br/>Attempts: ${dataPoint.y}<br/>Time on Task: ${dataPoint.z} sec</div>`;
// //       }
// //     },
// //     dataLabels: { enabled: false },
// //     fill: { opacity: 0.25 } // Make bubbles translucent
// //   };

// //   return (
// //     <div className="chart-card grey-background">
// //       <div className="chart-title">Class Engagement with Reading Passages</div>
// //       <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
// //       {engagementData.length === 0 && <div className="no-data">No data available</div>}
// //     </div>
// //   );
// // };

// // export default ClassEngagementBubbleChart;


// import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import "./ClassEngagementBubbleChart.css";

// const ClassEngagementBubbleChart = ({ readingAttempts = [], assessments = [] }) => {
//   const [engagementData, setEngagementData] = useState([]);
//   const [passageData, setPassageData] = useState([]);

//   useEffect(() => {
//     if (!readingAttempts.length || !assessments.length) {
//       setEngagementData([]);
//       setPassageData([]);
//       return;
//     }

//     const passageMap = new Map();
//     const titleMap = {};

//     // Group reading attempts by student and passage
//     readingAttempts.forEach((attempt) => {
//       const assessment = assessments.find(a => a._id?.$oid === attempt.readingAssessmentId);
//       if (!assessment) return;

//       const title = assessment.title || "Untitled";

//       // Ensure the passage is in the map
//       if (!passageMap.has(title)) {
//         passageMap.set(title, { id: `P${passageMap.size + 1}`, title, color: `#${Math.floor(Math.random() * 16777215).toString(16)}` });
//       }
//       const passage = passageMap.get(title);

//       // Initialize titleMap if not already initialized
//       if (!titleMap[title]) {
//         titleMap[title] = { name: title, data: [] };
//       }

//       // Find existing student data or create new data for this student and passage
//       const existingStudentData = titleMap[title].data.find((data) => data.name === attempt.studentUsername);

//       if (existingStudentData) {
//         // Increment the number of attempts for the student and add time spent on this passage
//         existingStudentData.y += 1;
//         existingStudentData.z += Math.round(attempt.timeOnTask);
//       } else {
//         // Create new data for the student if it's their first attempt on this passage
//         titleMap[title].data.push({
//           x: passageMap.size, // Passage index on the X-axis
//           y: 1, // First attempt for this student
//           z: Math.round(attempt.timeOnTask), // Time spent on this attempt
//           name: attempt.studentUsername,
//           passageId: passage.id,
//           color: passage.color
//         });
//       }
//     });

//     // Prepare the passage data and engagement data
//     setPassageData(Array.from(passageMap.values()));
//     setEngagementData(Object.values(titleMap));
//   }, [readingAttempts, assessments]);

//   // Prepare series data for the chart with horizontal spacing for same attempts
//   const seriesData = passageData.map((passage, index) => {
//     let studentIndex = 0; // To help spread out bubbles horizontally for the same number of attempts

//     return {
//       name: `${passage.id} - ${passage.title}`,
//       data: (engagementData.find(d => d.name === passage.title)?.data || []).map(d => {
//         // Add a slight horizontal offset for each bubble with the same number of attempts
//         const adjustedX = index + studentIndex * 0.3; // Horizontal offset
//         const adjustedY = d.y; // Keep the Y value as is (number of attempts)

//         studentIndex++;

//         return {
//           x: adjustedX, // Adjusted horizontal value to avoid overlap
//           y: adjustedY, // Keep original Y value (attempt count)
//           z: d.z, // Total time spent (sum of timeOnTask)
//           name: d.name,
//           passageId: d.passageId,
//           backgroundColor: passage.color
//         };
//       })
//     };
//   });

//   const chartOptions = {
//     chart: { 
//       type: "bubble", 
//       height: 500, 
//       toolbar: { show: false }, // Disable zoom
//       zoom: { enabled: false }
//     },
//     xaxis: {
//       title: { text: "Passages", style: { fontSize: "14px", fontWeight: "normal" } },
//       categories: passageData.map(p => p.id),
//       labels: { style: { fontSize: "12px" } }
//     },
//     yaxis: {
//       title: { text: "Number of Attempts", style: { fontSize: "14px", fontWeight: "normal" } },
//       labels: { style: { fontSize: "12px" } }
//     },
//     legend: {
//       show: true,
//       position: "bottom",
//       fontSize: "10px",
//       itemMargin: { horizontal: 5, vertical: 2 }
//     },
//     tooltip: {
//       enabled: true,
//       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
//         const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
//         return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Passage ID: ${dataPoint.passageId}<br/>Attempts: ${dataPoint.y}<br/>Time on Task: ${dataPoint.z} sec</div>`;
//       }
//     },
//     dataLabels: { enabled: false },
//     fill: { opacity: 0.25 } // Make bubbles translucent
//   };

//   return (
//     <div className="chart-card grey-background">
//       <div className="chart-title">Class Engagement with Reading Passages</div>
//       <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
//       {engagementData.length === 0 && <div className="no-data">No data available</div>}
//     </div>
//   );
// };

// export default ClassEngagementBubbleChart;

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./ClassEngagementBubbleChart.css";

const ClassEngagementBubbleChart = ({ readingAttempts = [], assessments = [] }) => {
  const [engagementData, setEngagementData] = useState([]);
  const [passageData, setPassageData] = useState([]);

  useEffect(() => {
    if (!readingAttempts.length || !assessments.length) {
      setEngagementData([]);
      setPassageData([]);
      return;
    }

    const passageMap = new Map();
    const titleMap = {};

    // Group reading attempts by student and passage
    readingAttempts.forEach((attempt) => {
      const assessment = assessments.find(a => a._id?.$oid === attempt.readingAssessmentId);
      if (!assessment) return;

      const title = assessment.title || "Untitled";

      // Ensure the passage is in the map
      if (!passageMap.has(title)) {
        passageMap.set(title, { id: `P${passageMap.size + 1}`, title, color: `#${Math.floor(Math.random() * 16777215).toString(16)}` });
      }
      const passage = passageMap.get(title);

      // Initialize titleMap if not already initialized
      if (!titleMap[title]) {
        titleMap[title] = { name: title, data: [] };
      }

      // Find existing student data or create new data for this student and passage
      const existingStudentData = titleMap[title].data.find((data) => data.name === attempt.studentUsername);

      if (existingStudentData) {
        // Increment the number of attempts for the student and add time spent on this passage
        existingStudentData.y += 1;
        existingStudentData.z += Math.round(attempt.timeOnTask);
      } else {
        // Create new data for the student if it's their first attempt on this passage
        titleMap[title].data.push({
          x: passageMap.size, // Passage index on the X-axis
          y: 1, // First attempt for this student
          z: Math.round(attempt.timeOnTask), // Time spent on this attempt
          name: attempt.studentUsername,
          passageId: passage.id,
          color: passage.color
        });
      }
    });

    // Prepare the passage data and engagement data
    setPassageData(Array.from(passageMap.values()));
    setEngagementData(Object.values(titleMap));
  }, [readingAttempts, assessments]);

  // Prepare series data for the chart with horizontal spacing for same attempts
  const seriesData = passageData.map((passage, index) => {
    let studentIndex = 0; // To help spread out bubbles horizontally for the same number of attempts

    return {
      name: `${passage.id} - ${passage.title}`,
      data: (engagementData.find(d => d.name === passage.title)?.data || []).map(d => {
        // Add a more noticeable horizontal offset for each bubble with the same number of attempts
        const adjustedX = index + studentIndex * 0.5; // Increase horizontal offset for more spread
        const adjustedY = d.y; // Keep the Y value as is (number of attempts)

        studentIndex++; // Increment studentIndex to move the next bubble horizontally

        return {
          x: adjustedX, // Adjusted horizontal value to avoid overlap
          y: adjustedY, // Keep original Y value (attempt count)
          z: d.z, // Total time spent (sum of timeOnTask)
          name: d.name,
          passageId: d.passageId,
          backgroundColor: passage.color
        };
      })
    };
  });

  const chartOptions = {
    chart: { 
      type: "bubble", 
      height: 500, 
      toolbar: { show: false }, // Disable zoom
      zoom: { enabled: false }
    },
    xaxis: {
      title: { text: "Passages", style: { fontSize: "14px", fontWeight: "normal" } },
      categories: passageData.map(p => p.id),
      labels: { style: { fontSize: "12px" } }
    },
    yaxis: {
      title: { text: "Number of Attempts", style: { fontSize: "14px", fontWeight: "normal" } },
      labels: { style: { fontSize: "12px" } }
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "10px",
      itemMargin: { horizontal: 5, vertical: 2 }
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 5px;">Student: ${dataPoint.name}<br/>Passage ID: ${dataPoint.passageId}<br/>Attempts: ${dataPoint.y}<br/>Time on Task: ${dataPoint.z} sec</div>`;
      }
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.25 } // Make bubbles translucent
  };

  return (
    <div className="chart-card grey-background">
      <div className="chart-title">Class Engagement with Reading Passages</div>
      <Chart options={chartOptions} series={seriesData} type="bubble" height={500} />
      {engagementData.length === 0 && <div className="no-data">No data available</div>}
    </div>
  );
};

export default ClassEngagementBubbleChart;
