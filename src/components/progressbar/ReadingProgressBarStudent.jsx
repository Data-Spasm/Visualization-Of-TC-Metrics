import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ReadingProgressBarStudent.css";

// This component visualizes reading progress and performance metrics for a single student.
const ReadingProgressBarCard = ({ miscues = [], studentUsername }) => {
  const navigate = useNavigate();
  const [loadingPassageId, setLoadingPassageId] = useState(null);

  // This effect is used to track the loading state of the passage ID when a user clicks on a bar.
  const progressData = [
    {label: "Substitutions",key: "numSubs",color: "#e74c3c", summary: "Usually reflects decoding difficulties or word confusion."},
    {label: "Reversals",key: "numRevs",color: "#f97316",summary: "May indicate issues with visual processing or orientation."},
    {label: "Omissions",key: "numDels",color: "#facc15",summary: "Often due to skipped words or attention lapses."},
    {label: "Insertions",key: "numIns",color: "#38bdf8",summary: "Common when students guess or add words unconsciously."},
    {label: "Repetitions",key: "numReps",color: "#6366f1",summary: "Linked to hesitancy or uncertainty in reading."}
  ];

  const storyInsight = useMemo(() => {
    if (!Array.isArray(miscues) || miscues.length === 0) return null;

    const totals = progressData.map(({ label, key }) => {
      const sum = miscues.reduce((acc, curr) => acc + (curr[key] || 0), 0);
      return { label, total: sum };
    });

    const sorted = [...totals].sort((a, b) => b.total - a.total);
    const top = sorted[0];

    if (top.total === 0) return "No miscues were recorded for this student.";

    return `${top.label} occurred most frequently across all passages (${top.total} total instances).`;
  }, [miscues]);

  const miscuesBySkill = useMemo(() => {
    const map = {};

    progressData.forEach(({ key }) => {
      map[key] = {
        total: 0,
        maxPassage: null,
        maxValue: 0,
      };

      miscues.forEach((entry) => {
        const value = entry[key] || 0;
        map[key].total += value;

        if (value > map[key].maxValue) {
          map[key].maxValue = value;
          map[key].maxPassage = entry.passageTitle;
        }
      });
    });

    return map;
  }, [miscues]);

  if (!Array.isArray(miscues)) {
    console.warn("Invalid miscues prop passed to ReadingProgressBarCard:", miscues);
    return <div>No miscues to display.</div>;
  }

  return (
    <div className="progress-card-container">
      {storyInsight && (
        <div className="story-summary">
          <p>{storyInsight}</p>
        </div>
      )}

      <p style={{ fontStyle: "italic", marginBottom: "1rem", color: "#6b7280" }}>
        Click on the bars below to view detailed insights for each passage.
      </p>

      {loadingPassageId && (
        <p style={{ color: "#2563eb", fontWeight: 500 }}>
          Loading insights for passage...
        </p>
      )}

      <div className="progress-metrics-grid">
        {progressData.map((metric) => {
          const filtered = miscues.filter((entry) => {
            const value = entry[metric.key] || 0;
            const total = value + (entry.numCorrect || 0);
            return !!entry.passageTitle && total > 0;
          });

          const summary = metric.summary;
          const hotspot = miscuesBySkill[metric.key]?.maxPassage;
          const total = miscuesBySkill[metric.key]?.total;

          return (
            <div key={metric.key} className="progress-metric-section">
              <h4 className="progress-metric-title">{metric.label}</h4>

              <div className="mini-summary">
              <p
              style={{
                minHeight: "60px", 
                lineHeight: "1.4",
                marginBottom: "0.25rem"
              }}
            >
              {summary}
            </p>
                <p
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  marginTop: "4px",
                  minHeight: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "160px",
                }}
                title={hotspot || ""}
              >
                {hotspot ? (
                  <>
                    Most frequent in: <strong>{hotspot}</strong>
                  </>
                ) : (
                  <>No recorded {metric.label.toLowerCase()}.</>
                )}
              </p>

              </div>


              {filtered.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                  No data for {metric.label}.
                </p>
              ) : (
                filtered.map((entry) => {
                  const value = entry[metric.key] || 0;
                  const total = value + (entry.numCorrect || 0);
                  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
                  const tooltip = `${entry.passageTitle}\n${metric.label}: ${value}\nCorrect Words: ${entry.numCorrect}\nTotal Words: ${total}`;

                  const handleClick = () => {
                    if (entry.passageId && studentUsername) {
                      setLoadingPassageId(entry.passageId);
                      setTimeout(() => {
                        navigate(`/passages/${studentUsername}/${entry.passageId}`);
                      }, 300);
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
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Totals row */}
      <div className="totals-row">
        <h4 className="totals-title">Total Miscues</h4>
        <ul className="totals-list">
          {progressData.map((metric) => (
            <li key={metric.key}>
              <span className="dot" style={{ backgroundColor: metric.color }}></span>
              {metric.label}: {miscuesBySkill[metric.key]?.total || 0}
            </li>
          ))}
        </ul>
      </div>

      {miscues.length > 0 && (
        <div className="callout-block">
          <strong>Tip:</strong> Use this overview to identify which reading skill (e.g., substitution, reversal) the student is struggling with most. Focus instruction or practice on the highest occurring error type.
        </div>
      )}
    </div>
  );
};

export default ReadingProgressBarCard;