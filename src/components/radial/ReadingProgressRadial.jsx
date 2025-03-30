import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReadingProgressRadial.css";

const CircularProgress = ({ percent = 0, color = "#3498db", label = "", value = 0, total = 0 }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const clampedPercent = Math.max(0, Math.min(percent, 100));
    const sweepAngle = (clampedPercent / 100) * 180;
  
    return (
      <div
        className="semi-circular-progress-wrapper"
        title={`${label}: ${value} / ${total}`}
      >
        <svg width={radius * 2} height={radius + stroke}>
          <path
            d={describeArc(radius, radius, normalizedRadius, 180, 360)}
            fill="none"
            stroke="#e6e6e6"
            strokeWidth={stroke}
          />
          <path
            d={describeArc(radius, radius, normalizedRadius, 180, 180 + sweepAngle)}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
  
        {/* Display value and label properly */}
        <div className="progress-value">{value}</div>
        <div className="progress-label">{label}</div>
      </div>
    );
  };
  

function describeArc(cx, cy, r, startAngle, endAngle) {
  const rad = angle => (Math.PI / 180) * angle;
  const x1 = cx + r * Math.cos(rad(startAngle));
  const y1 = cy + r * Math.sin(rad(startAngle));
  const x2 = cx + r * Math.cos(rad(endAngle));
  const y2 = cy + r * Math.sin(rad(endAngle));
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

const ReadingProgressRadialCard = ({ miscues = [], studentUsername }) => {
  const navigate = useNavigate();

  const progressData = [
    { label: "Omissions", key: "numDels", color: "#F1C40F" },
    { label: "Insertions", key: "numIns", color: "#3498DB" },
    { label: "Substitutions", key: "numSubs", color: "#2ECC71" },
    { label: "Repetitions", key: "numReps", color: "#9B59B6" },
    { label: "Reversals", key: "numRevs", color: "#E74C3C" },
  ];

  if (!Array.isArray(miscues)) {
    console.warn("Invalid miscues prop passed to ReadingProgressRadialCard:", miscues);
    return <div>No miscues to display.</div>;
  }

  const totalWords =
    miscues[0]?.numTotalWords ||
    progressData.reduce((sum, metric) => sum + (miscues[0]?.[metric.key] || 0), 0) +
    (miscues[0]?.numCorrect || 0);

  const totalMiscues = progressData.reduce((sum, m) => sum + (miscues[0]?.[m.key] || 0), 0);

  const mostFrequent = progressData
    .map(metric => ({ label: metric.label, value: miscues[0]?.[metric.key] || 0 }))
    .sort((a, b) => b.value - a.value)[0];

  const storyText = mostFrequent?.value
    ? `${mostFrequent.label} occurred most often across all passages (${mostFrequent.value} total instances).`
    : "No miscues were detected in the selected attempts.";

  return (
    <div className="radial-progress-card-container">
  {/* Summary at the top */}
  <div className="story-summary top-block">
    <strong>Miscue Breakdown</strong>
    <p>{storyText}</p>
  </div>

  {/* Radial bar grid in the center */}
  <div className="radial-metrics-grid">
    {progressData.map((metric) => {
      const value = miscues[0]?.[metric.key] || 0;
      const percent = totalWords > 0 ? (value / totalWords) * 100 : 0;

      return (
        <CircularProgress
          key={metric.key}
          percent={percent}
          color={metric.color}
          label={metric.label}
          value={value}
          total={totalWords}
        />
      );
    })}
  </div>

  {/* Tip at the bottom */}
  <div className="tip-block">
    <strong>Tip:</strong> Use this view to quickly compare miscue types. High values may signal where a student struggles most—e.g., decoding (substitutions), fluency (repetitions), or attention (omissions).
  </div>
</div>

  );
};

export default ReadingProgressRadialCard;
