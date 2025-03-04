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
      {/* Progress Bars Section (Left Side) */}
      <div className="progress-section">
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

      {/* Reading Attempts Section (Right Side) */}
      <div className="reading-attempts-card">
        <h2 className="reading-attempts-title">Reading Attempts: {performance?.readingAttempts || 0}</h2>
        <div className="reading-attempts-legend">
          {progressData.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: item.color }}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadingProgressBar;
