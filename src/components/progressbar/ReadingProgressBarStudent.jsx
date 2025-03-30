import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ReadingProgressBarStudent.css";

const ReadingProgressBarCard = ({ miscues = [], studentUsername }) => {
  const navigate = useNavigate();
  const [loadingPassageId, setLoadingPassageId] = useState(null);

  const progressData = [
    { label: "Omissions", key: "numDels", color: "#3DA35D", summary: "Often due to skipped words or attention lapses." },
    { label: "Insertions", key: "numIns", color: "#28B8D6", summary: "Common when students guess or add words unconsciously." },
    { label: "Substitutions", key: "numSubs", color: "#FDCB58", summary: "Usually reflects decoding difficulties or word confusion." },
    { label: "Repetitions", key: "numReps", color: "#8E44AD", summary: "Linked to hesitancy or uncertainty in reading." },
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
      <h3 className="progress-title">Progress Overview by Skill</h3>

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
                <p>{summary}</p>
                {hotspot && (
                  <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                    Most frequent in: <strong>{hotspot}</strong>
                  </p>
                )}
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
          <strong>Tip:</strong> Use this overview to identify which reading skill (e.g., substitution, omission) the student is struggling with most. Focus instruction or practice on the highest occurring error type.
        </div>
      )}
    </div>
  );
};

export default ReadingProgressBarCard;
