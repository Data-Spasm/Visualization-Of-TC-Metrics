import React from "react";
import { ResponsiveContainer } from "recharts";
import "./ReadingProgressBarStudent.css";

const ReadingProgressBarCard = () => {
  // Mock performance data for testing
  const mockPerformanceData = [
    { omissions: 10, insertions: 5, selfCorrections: 15, repetitions: 10 },
    { omissions: 15, insertions: 10, selfCorrections: 20, repetitions: 15 },
    { omissions: 20, insertions: 15, selfCorrections: 25, repetitions: 20 },
    { omissions: 25, insertions: 20, selfCorrections: 30, repetitions: 25 },
  ];

  // Data for the progress bars
  const progressData = [
    { label: "Omissions", key: "omissions", color: "#3DA35D" },
    { label: "Insertions", key: "insertions", color: "#28B8D6" },
    { label: "Self-Corrections", key: "selfCorrections", color: "#FDCB58" },
    { label: "Repetitions", key: "repetitions", color: "#8E44AD" },
  ];

  return (
    <div className="progress-card-container">
      <ResponsiveContainer width="100%" height={250}>
        <div className="progress-metrics-grid">
          {progressData.map((metric, index) => (
            <div key={index} className="progress-metric-section">
              <h4 className="progress-metric-title">{metric.label}</h4>
              {mockPerformanceData.map((passage, idx) => (
                <div key={idx} className="progress-bar-container">
                  <div className="progress-label">{`Passage ${idx + 1}`}</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${passage[metric.key]}%`, backgroundColor: metric.color }}
                    ></div>
                    <span className="progress-percentage">{`${passage[metric.key]}%`}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadingProgressBarCard;