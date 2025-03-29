import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import "./ReadingAssessmentDataTileSquare.css";

const TILE_SIZE = 16;
const TILE_GAP = 4;

const ReadingAssessmentDataTileView = ({ readingAttempts = [], assessments = [], studentUsername = null }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const titleMap = {};

    const filteredAttempts = studentUsername
      ? readingAttempts.filter(attempt => attempt.studentUsername === studentUsername)
      : readingAttempts;

    filteredAttempts.forEach((attempt) => {
      const assessment = assessments.find(
        (a) => a._id?.$oid === attempt.readingAssessmentId
      );
      const title = assessment?.title || "Untitled";

      if (!titleMap[title]) {
        titleMap[title] = { passage: title, tiles: [] };
      }

      titleMap[title].tiles.push({
        type: attempt.quit ? "quit" : "completed",
        student: attempt.studentUsername
      });
    });

    Object.values(titleMap).forEach(entry => {
      entry.tiles.sort((a, b) => a.type.localeCompare(b.type));
    });

    setData(Object.values(titleMap));
  }, [readingAttempts, assessments, studentUsername]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Reading Passage Completion</h3>

      <ResponsiveContainer width="100%" height={data.length * 40 + 80}>
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
                  color: "#333"
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
                    title={studentUsername
                      ? `Status: ${type === "completed" ? "Completed" : "Quit"}`
                      : `Student: ${student}\nStatus: ${type === "completed" ? "Completed" : "Quit"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>

      <div className="tile-legend" style={{ marginTop: "0.75rem", textAlign: "center" }}>
        <div className="legend-item">
          <div className="tile completed" /> <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="tile quit" /> <span>Quit</span>
        </div>
      </div>
    </div>
  );
};

export default ReadingAssessmentDataTileView;