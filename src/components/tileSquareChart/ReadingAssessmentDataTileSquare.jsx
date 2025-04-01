import React, { useState, useEffect } from "react";
import "./ReadingAssessmentDataTileSquare.css";

const TILE_SIZE = 16;
const TILE_GAP = 4;

const ReadingAssessmentDataTileView = ({ readingAttempts = [], assessments = [], studentUsername = null }) => {
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const titleMap = {};
    const quitCounts = {};
    const completeCounts = {};
    const studentQuitMap = {};

    const filteredAttempts = studentUsername
      ? readingAttempts.filter(attempt => attempt.studentUsername === studentUsername)
      : readingAttempts;

    filteredAttempts.forEach((attempt) => {
      const assessment = assessments.find((a) => {
        const id = String(a._id?.$oid || a._id);
        return id === String(attempt.readingAssessmentId);
      });
      
      const title = assessment?.title || "Untitled";

      if (!titleMap[title]) {
        titleMap[title] = { passage: title, tiles: [] };
        quitCounts[title] = 0;
        completeCounts[title] = 0;
      }

      const type = attempt.quit ? "quit" : "completed";
      titleMap[title].tiles.push({ type, student: attempt.studentUsername });

      if (type === "quit") {
        quitCounts[title]++;
        if (studentUsername) {
          studentQuitMap[studentUsername] = (studentQuitMap[studentUsername] || 0) + 1;
        }
      } else {
        completeCounts[title]++;
      }
    });

    Object.values(titleMap).forEach(entry => {
      entry.tiles.sort((a, b) => a.type.localeCompare(b.type));
    });

    setData(Object.values(titleMap));

    // Generate insight
    if (studentUsername) {
      const total = filteredAttempts.length;
      const quits = studentQuitMap[studentUsername] || 0;
      const rate = ((quits / total) * 100).toFixed(0);
      setInsight(
        quits === 0
          ? `${studentUsername} completed all assigned passages.`
          : `${studentUsername} quit ${quits} of ${total} passages (${rate}%). Consider reviewing difficulty or engagement.`
      );
    } else {
      const quitMax = Object.entries(quitCounts).sort((a, b) => b[1] - a[1])[0];
      const completeMax = Object.entries(completeCounts).sort((a, b) => b[1] - a[1])[0];

      if (quitMax && completeMax) {
        setInsight(
          `"${completeMax[0]}" had the highest completions (${completeMax[1]}), while "${quitMax[0]}" had the most quits (${quitMax[1]}). Use this to reassess passage selection or pacing.`
        );
      } else {
        setInsight("No passage completion data available.");
      }
    }
  }, [readingAttempts, assessments, studentUsername]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Reading Passage Completion</h3>

      <div className="story-summary">
        <p>{insight}</p>
      </div>

      {/* Fixed-height, scrollable tile grid */}
      <div
        className="scrollable-area"
        style={{
          width: "100%",
          height: "310px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "8px",
        }}
      >

        <div className="responsive-tile-wrapper">
          {data.map(({ passage, tiles }) => (
            <div key={passage} className="tile-row">
              <div
                className="tile-label"
                title={passage}
                style={{
                  maxWidth: "180px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                {passage}
              </div>
              <div className="tile-grid">
                {tiles.map(({ type, student }, idx) => (
                  <div
                    key={idx}
                    className={`tile ${type}`}
                    style={{
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      margin: TILE_GAP / 2,
                      borderRadius: 3,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    title={
                      studentUsername
                        ? `Status: ${type === "completed" ? "Completed" : "Quit"}`
                        : `Student: ${student}\nStatus: ${type === "completed" ? "Completed" : "Quit"}`
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tile-legend" style={{ marginTop: "0.75rem", textAlign: "center" }}>
        <div className="legend-item">
          <div className="tile completed" /> <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="tile quit" /> <span>Quit</span>
        </div>
      </div>

      {data.length > 0 && (
        <div className="callout-block">
          {studentUsername ? (
            <>
              <strong>Tip:</strong> If {studentUsername} frequently quits passages, consider reviewing text difficulty,
              engagement, or external factors like reading environment. This insight can guide personalized interventions.
            </>
          ) : (
            <>
              <strong>Tip:</strong> Hover over squares to identify which students are quitting early. Repeated quit patterns
              could signal a passage that needs simplification or support.
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingAssessmentDataTileView;
