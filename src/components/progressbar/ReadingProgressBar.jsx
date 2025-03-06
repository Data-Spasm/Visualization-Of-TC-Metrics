// import React from "react";
// import "./ReadingProgressBar.css";

// const ReadingProgressBar = ({ performance }) => {
//   // Data for the progress bars
//   const progressData = [
//     { label: "Substitutions", value: performance?.substitutions || 0, color: "#FF5733" },
//     { label: "Insertions", value: performance?.insertions || 0, color: "#28B8D6" },
//     { label: "Omissions", value: performance?.omissions || 0, color: "#3DA35D" },
//     { label: "Repetitions", value: performance?.repetitions || 0, color: "#8E44AD" },
//     { label: "Reversals", value: performance?.reversals || 0, color: "#FDCB58" },
//   ];

//   return (
//     <div>
//       {/* Reading Attempts Heading (Placed above the progress container) */}
//       <div className="reading-attempts-title-container">
//         <h4 className="reading-attempts-title">Reading Attempts: {performance?.readingAttempts || 0}</h4>
//       </div>

//       <div className="progress-reading-container">
//         {/* Progress Bar Section (First Section) */}
//         <div className="progress-bar-section">
//           {progressData.map((item, index) => (
//             <div key={index} className="progress-bar">
//               <div
//                 className="progress-fill"
//                 style={{ width: `${item.value}%`, backgroundColor: item.color }}
//               ></div>
//               <span className="progress-label">{item.label} ({item.value}%)</span>
//             </div>
//           ))}
//         </div>

//         {/* Legend Section for Mispronunciation, Omission, Insertion (Second Section) */}
//         <div className="legend-section">
//           <div className="legend-items">
//             <div className="legend-item">
//               <div className="legend-color" style={{ backgroundColor: "#FF5733" }}></div>
//               <span>Mispronunciation</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color" style={{ backgroundColor: "#3DA35D" }}></div>
//               <span>Omissions</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color" style={{ backgroundColor: "#28B8D6" }}></div>
//               <span>Insertions</span>
//             </div>
//           </div>
//         </div>

//         {/* Legend Section for Self-Correction, Repetition (Third Section) */}
//         <div className="legend-section">
//           <div className="legend-items">
//             <div className="legend-item">
//               <div className="legend-color" style={{ backgroundColor: "#FDCB58" }}></div>
//               <span>Self-Correction</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color" style={{ backgroundColor: "#8E44AD" }}></div>
//               <span>Repetitions</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReadingProgressBar;





import React from "react";
import "./ReadingProgressBar.css";

const ReadingProgressBar = ({ performance }) => {
  // Data for the progress bars
  const progressData = [
    { label: "Substitutions", value: performance?.substitutions || 0, color: "#FF5733" },
    { label: "Insertions", value: performance?.insertions || 0, color: "#28B8D6" },
    { label: "Omissions", value: performance?.omissions || 0, color: "#3DA35D" },
    { label: "Repetitions", value: performance?.repetitions || 0, color: "#8E44AD" },
    { label: "Reversals", value: performance?.reversals || 0, color: "#FDCB58" },
  ];

  return (
    <div className="progress-reading-container">
      {/* Progress Bar Section (First Section) */}
      <div className="progress-bar-section">
        {progressData.map((item, index) => (
          <div key={index} className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${item.value}%`, backgroundColor: item.color }}
            ></div>
            <span className="progress-label">{item.label} ({item.value}%)</span>
          </div>
        ))}
      </div>

      {/* Reading Attempts Heading (Above the Legend Sections) */}
      <div className="reading-attempts-title-container">
        <h6 className="reading-attempts-title">Reading Attempts: {performance?.readingAttempts || 0}</h6>
      </div>

      {/* Legend Section for Mispronunciation, Omission, Insertion (Second Section) */}
      <div className="legend-section">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: "#FF5733" }}></div>
            <span>Mispronunciation</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: "#3DA35D" }}></div>
            <span>Omissions</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: "#28B8D6" }}></div>
            <span>Insertions</span>
          </div>
        </div>
      </div>

      {/* Legend Section for Self-Correction, Repetition (Third Section) */}
      <div className="legend-section">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: "#FDCB58" }}></div>
            <span>Self-Correction</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: "#8E44AD" }}></div>
            <span>Repetitions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingProgressBar;
