import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReadingProgressRadial.css";

const CircularProgress = ({ percent = 0, color = "#3498db", label = "", value = 0, total = 0 }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;

  // Clamp to prevent rendering bugs
  const clampedPercent = Math.max(0, Math.min(percent, 100));
  const sweepAngle = (clampedPercent / 100) * 180;

  return (
    <div
      className="semi-circular-progress-wrapper"
      title={`${value} / ${total}`} // Tooltip showing value out of total
    >
      <div className="progress-label">{label}</div>
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
      <div className="progress-value">{value}</div>
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
  ];

  if (!Array.isArray(miscues)) {
    console.warn("Invalid miscues prop passed to ReadingProgressRadialCard:", miscues);
    return <div>No miscues to display.</div>;
  }

  const totalWords =
    miscues[0]?.numTotalWords ||
    miscues[0]?.numDels +
    miscues[0]?.numIns +
    miscues[0]?.numSubs +
    miscues[0]?.numReps +
    miscues[0]?.numCorrect;

  return (
    <div className="radial-progress-card-container">
      <div className="radial-metrics-grid">
        {progressData.map(metric => {
          const value = miscues[0]?.[metric.key] || 0;
          const percent = totalWords > 0 ? (value / totalWords) * 100 : 0;

          return (
            <CircularProgress
              key={metric.key}
              percent={percent}
              color={metric.color}
              label={metric.label}
              value={value}
              total={totalWords} // Pass total words for the tooltip
            />
          );
        })}
      </div>
    </div>
  );
};

export default ReadingProgressRadialCard;