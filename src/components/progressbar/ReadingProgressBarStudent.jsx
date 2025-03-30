import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReadingProgressBarStudent.css";

const ReadingProgressBarCard = ({ miscues = [], studentUsername }) => {
  const navigate = useNavigate();
  const [loadingPassageId, setLoadingPassageId] = useState(null);

  const progressData = [
    { label: "Omissions", key: "numDels", color: "#3DA35D" },
    { label: "Insertions", key: "numIns", color: "#28B8D6" },
    { label: "Substitutions", key: "numSubs", color: "#FDCB58" },
    { label: "Repetitions", key: "numReps", color: "#8E44AD" },
  ];

  if (!Array.isArray(miscues)) {
    console.warn("Invalid miscues prop passed to ReadingProgressBarCard:", miscues);
    return <div>No miscues to display.</div>;
  }

  return (
    <div className="progress-card-container">
      <p style={{ fontStyle: "italic", marginBottom: "1rem", color: "#6b7280" }}>
        Click on the bars below to view detailed insights for each passage.
      </p>

      {loadingPassageId && (
        <p style={{ color: "#2563eb", fontWeight: 500 }}>
          Loading insights for passage...
        </p>
      )}

      <div className="progress-metrics-grid">
        {progressData.map((metric) => (
          <div key={metric.key} className="progress-metric-section">
            <h4 className="progress-metric-title">{metric.label}</h4>

            {miscues.map((entry) => {
              const value = entry[metric.key] || 0;
              const total = value + (entry.numCorrect || 0);
              const percent = total > 0 ? Math.round((value / total) * 100) : 0;
              const tooltip = `${entry.passageTitle || "Untitled"}\n${metric.label}: ${value}\nCorrect Words: ${entry.numCorrect}\nTotal Words: ${total}`;

              const handleClick = () => {
                if (entry.passageId && studentUsername) {
                  setLoadingPassageId(entry.passageId);
                  setTimeout(() => {
                    navigate(`/passages/${studentUsername}/${entry.passageId}`);
                  }, 300); // Optional delay for smoother experience
                }
              };

              return (
                <div
                  key={`${entry.passageId}-${metric.key}`}
                  className="progress-bar-container"
                  title={tooltip}
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                >
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
