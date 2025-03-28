import React from "react";
import { ResponsiveContainer } from "recharts";
import "./ReadingProgressBarStudent.css";

const ReadingProgressBarCard = ({ miscues = [] }) => {
  const progressData = [
    { label: "Omissions", key: "numDels", color: "#3DA35D" },
    { label: "Insertions", key: "numIns", color: "#28B8D6" },
    { label: "Self-Corrections", key: "numSelfs", color: "#FDCB58" },
    { label: "Repetitions", key: "numReps", color: "#8E44AD" },
  ];

  if (!Array.isArray(miscues)) {
    console.warn("Invalid miscues prop passed to ReadingProgressBarCard:", miscues);
    return <div>No miscues to display.</div>;
  }

  return (
    <div className="progress-card-container">
      <div className="progress-metrics-grid">
        {progressData.map((metric, index) => (
          <div key={index} className="progress-metric-section">
            <h4 className="progress-metric-title">{metric.label}</h4>
            {miscues.map((entry, idx) => {
              const value = entry[metric.key] || 0;
              const total = value + (entry.numCorrect || 0);
              const percent = total > 0 ? Math.round((value / total) * 100) : 0;
              const tooltip = `${entry.passageTitle || "Untitled"}\n${metric.label}: ${value}\nCorrect Words: ${entry.numCorrect}\nTotal Words: ${total}`;
  
              return (
                <div key={idx} className="progress-bar-container" title={tooltip}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%`, backgroundColor: metric.color }}
                    ></div>
                    <span className="progress-percentage">{`${percent}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );  
};

export default ReadingProgressBarCard;
