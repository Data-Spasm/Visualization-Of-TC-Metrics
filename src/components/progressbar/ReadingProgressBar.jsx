import React, { useMemo } from "react";
import "./ReadingProgressBar.css";

const ReadingProgressBar = ({ students = [], readingAttempts = [] }) => {
  const performance = useMemo(() => {
    if (students.length === 0) return {};

    const metricDetails = {
      substitutions: [],
      insertions: [],
      omissions: [],
      repetitions: [],
      reversals: [],
    };

    students.forEach((s) => {
      const perf = s.student?.reading?.overallPerformance || {};
      const name = s.student?.name || s.username;

      metricDetails.substitutions.push({ name, value: perf.overallSubstitutions || 0 });
      metricDetails.insertions.push({ name, value: perf.overallInsertions || 0 });
      metricDetails.omissions.push({ name, value: perf.overallOmissions || 0 });
      metricDetails.repetitions.push({ name, value: perf.overallRepetitions || 0 });
      metricDetails.reversals.push({ name, value: perf.overallReversals || 0 });
    });

    const averages = {};
    Object.entries(metricDetails).forEach(([key, data]) => {
      const total = data.reduce((sum, d) => sum + d.value, 0);
      const avg = total / data.length;
      const maxVal = Math.max(...data.map(d => d.value));
      const minVal = Math.min(...data.map(d => d.value));
      const maxStudents = data.filter(d => d.value === maxVal).map(d => d.name);
      const minStudents = data.filter(d => d.value === minVal).map(d => d.name);

      averages[key] = { avg, max: maxVal, min: minVal, maxStudents, minStudents };
    });

    return {
      readingAttempts: readingAttempts.length,
      ...averages,
    };
  }, [students, readingAttempts]);

  const progressData = [
    { key: "substitutions", label: "Substitutions", color: "#e74c3c" },
    { key: "reversals", label: "Reversals", color: "#f97316" },
    { key: "omissions", label: "Omissions", color: "#facc15" },
    { key: "insertions", label: "Insertions", color: "#38bdf8" },
    { key: "repetitions", label: "Repetitions", color: "#6366f1" },
  ];

  const totalAvg = progressData.reduce((sum, p) => sum + (performance[p.key]?.avg || 0), 0);

  const mostCommon = [...progressData].sort(
    (a, b) => (performance[b.key]?.avg || 0) - (performance[a.key]?.avg || 0)
  )[0];

  const storyInsight = mostCommon
    ? `Most frequent miscue: ${mostCommon.label} (avg ${performance[mostCommon.key]?.avg?.toFixed(2)}).`
    : "No data available for analysis.";

  return (
    <div className="bar-reading-container">
      <div className="reading-insight-block">
        <p>{storyInsight}</p>
      </div>

      <div className="reading-attempts-title-container">
        <h5 className="reading-attempts-title">
          Total Reading Attempts: {performance.readingAttempts || 0}
        </h5>
      </div>

      <div className="bar-section">
        {progressData.map((item, index) => {
          const stats = performance[item.key] || {};
          const percent = totalAvg ? (stats.avg / totalAvg) * 100 : 0;

          const tooltipText = `${item.label}
Average per student: ${stats.avg?.toFixed(2)}
Highest: ${stats.max} (${stats.maxStudents?.join(", ")})
Lowest: ${stats.min} (${stats.minStudents?.join(", ")})
Contribution to total miscues: ${percent.toFixed(1)}%`;

          return (
            <div key={index} className="bar" title={tooltipText}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color,
                    borderTopRightRadius: percent > 98 ? "999px" : "0",
                    borderBottomRightRadius: percent > 98 ? "999px" : "0",
                  }}
                />
                <span className="bar-percent-label">{percent.toFixed(1)}%</span>
              </div>
              <span className="bar-label">
                {item.label} (avg: {stats.avg?.toFixed(2)})
              </span>
            </div>
          );
        })}
      </div>

      <div className="legend-wrapper">
        {progressData.map((item, index) => (
          <div className="legend-item" key={index}>
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {mostCommon && (
        <div className="callout-block">
          <strong>Tip:</strong> If <strong>{mostCommon.label}</strong> continue to dominate class miscues,
          consider building targeted mini-lessons or practice passages to address this skill gap.
        </div>
      )}
    </div>
  );
};

export default ReadingProgressBar;
