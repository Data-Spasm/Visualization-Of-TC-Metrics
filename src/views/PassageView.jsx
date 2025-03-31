import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assessAttempt } from "../utils/assessAttempt";
import ReadingProgressRadialCard from "../components/radial/ReadingProgressRadial";
import "./PassageView.css";

const PassageView = ({
  student,
  passageId: initialPassageId,
  attempts = [],
  allAttempts = [],
  assessments = []
}) => {
  const navigate = useNavigate();

  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);
  const [miscueSummary, setMiscueSummary] = useState({});
  const [totalSummary, setTotalSummary] = useState({});
  const [highlightedContent, setHighlightedContent] = useState("");
  const [rawAttempt, setRawAttempt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [originalText, setOriginalText] = useState("Loading...");
  const [attemptDuration, setAttemptDuration] = useState(null);

  const metrics = [
    { key: "numDels", label: "Omissions", color: "yellow" },
    { key: "numIns", label: "Insertions", color: "blue" },
    { key: "numReps", label: "Repetitions", color: "purple" },
    { key: "numSubs", label: "Substitutions", color: "green" },
    { key: "numRevs", label: "Reversals", color: "red" }
  ];

  const filteredAttempts = useMemo(() => {
    return attempts.filter(a => a.readingAssessmentId === initialPassageId);
  }, [attempts, initialPassageId]);

  useEffect(() => {
    const allSegments = allAttempts
      .filter(a => Array.isArray(a.readingAttempts))
      .flatMap(a => a.readingAttempts);

    const results = allSegments.map(s => {
      try {
        return assessAttempt(s.readingContent || "", s.rawAttempt || "");
      } catch {
        return { numDels: 0, numIns: 0, numReps: 0, numSubs: 0, numRevs: 0 };
      }
    });

    const totalWords = allSegments.reduce((acc, seg) => {
      const words = (seg.readingContent || "").split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);

    const totals = results.reduce((acc, r) => {
      acc.numDels += r.numDels || 0;
      acc.numIns += r.numIns || 0;
      acc.numReps += r.numReps || 0;
      acc.numSubs += r.numSubs || 0;
      acc.numRevs += r.numRevs || 0;
      return acc;
    }, { numDels: 0, numIns: 0, numReps: 0, numSubs: 0, numRevs: 0 });

    setTotalSummary({ ...totals, numTotalWords: totalWords });
  }, [allAttempts]);

  useEffect(() => {
    if (!filteredAttempts.length || !assessments.length || !initialPassageId) return;

    const currentAttempt = filteredAttempts[selectedAttemptIndex];
    if (!currentAttempt?.readingAttempts?.length) return;

    const matchedAssessment = assessments.find(
      a => a._id?.$oid === initialPassageId || a._id === initialPassageId
    );
    setAssessment(matchedAssessment);

    const combinedPassage = currentAttempt.readingAttempts
      .map(p => p.readingContent)
      .join(" ")
      .trim();
    setOriginalText(combinedPassage || "No passage text available.");

    const paragraphResults = currentAttempt.readingAttempts.map(a => {
      try {
        return assessAttempt(a.readingContent || "", a.rawAttempt || "");
      } catch {
        return {
          numDels: 0, numIns: 0, numReps: 0, numSubs: 0, numRevs: 0,
          attemptWithMiscues: [],
        };
      }
    });

    const totalSummary = paragraphResults.reduce((acc, res) => {
      acc.numDels += res.numDels || 0;
      acc.numIns += res.numIns || 0;
      acc.numReps += res.numReps || 0;
      acc.numSubs += res.numSubs || 0;
      acc.numRevs += res.numRevs || 0;
      return acc;
    }, { numDels: 0, numIns: 0, numReps: 0, numSubs: 0, numRevs: 0 });

    const totalWords = currentAttempt.readingAttempts.reduce((acc, attempt) => {
      const wordCount = (attempt.readingContent || "").split(/\s+/).filter(Boolean).length;
      return acc + wordCount;
    }, 0);

    setMiscueSummary({ ...totalSummary, numTotalWords: totalWords });

    const allHighlights = paragraphResults.map(res =>
      res.attemptWithMiscues?.map(({ word, miscue }) => {
        if (miscue === "Omission") return `<span class="omission ghost-word">[${word}]</span>`;
        if (!word) return "";
        const className = miscue.toLowerCase().replace(" ", "-");
        return `<span class="${className}">${word}</span>`;
      }).join(" ")
    ).join("<br/>");

    const allRaw = currentAttempt.readingAttempts.map(a => a.rawAttempt || "").join(" ");
    setHighlightedContent(allHighlights);
    setRawAttempt(allRaw);

    const audioReference = currentAttempt.readingAttempts?.[0]?.readingActionRecords?.find(r => r.audioReference)?.audioReference;
    setAudioUrl(audioReference ? `/recordings/${audioReference}` : "");

    const durationSeconds = parseFloat(currentAttempt.timeOnTask);
    setAttemptDuration(isNaN(durationSeconds) ? null : Math.round(durationSeconds));
  }, [filteredAttempts, selectedAttemptIndex, assessments, initialPassageId]);

  useEffect(() => {
    setSelectedAttemptIndex(0);
  }, [initialPassageId]);

  const correctWords = (miscueSummary.numTotalWords || 0) - ((miscueSummary.numDels || 0) + (miscueSummary.numSubs || 0));
  const totalCorrectWords = (totalSummary.numTotalWords || 0) - ((totalSummary.numDels || 0) + (totalSummary.numSubs || 0));

  return (
    <div className="passage-view-container">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem"
      }}>
        <h2 className="title">
          Student: {student?.firstName} {student?.lastName || "Unnamed Student"}
        </h2>
        <button onClick={() => navigate(`/students/${student._id?.$oid || student._id}`)}
          style={{
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
          ← Back to Student Dashboard
        </button>
      </div>

      <h4 style={{ marginTop: 0, color: "#0ea5e9" }}>
        Total Correct Words (all passages): {totalCorrectWords}
      </h4>

      <ReadingProgressRadialCard
        miscues={[{
          ...totalSummary,
          passageTitle: "All Passages"
        }]}
      />

      <div className="passage-box">
        <div className="passage-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <h2 style={{ margin: 0 }}>
            <strong>Passage: "{assessment?.readingContent?.readingMaterial?.passageTitle || "Untitled Passage"}”</strong>
          </h2>

          <div className="attempt-selector">
            <label htmlFor="passageSelect">Change Passage:</label>
            <select
              id="passageSelect"
              value={initialPassageId}
              onChange={e => navigate(`/passages/${student.username}/${e.target.value}`)}
            >
              {assessments.filter(assessment => {
                const assessmentId = assessment._id?.$oid || assessment._id;
                return allAttempts.some(attempt => attempt.readingAssessmentId === assessmentId);
              }).map(a => (
                <option key={a._id?.$oid || a._id} value={a._id?.$oid || a._id}>
                  {a.readingContent?.readingMaterial?.passageTitle || "Untitled Passage"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h4 style={{ marginBottom: "0.5rem", color: "#059669" }}>
          Correct Words: {correctWords}
        </h4>

        {attemptDuration !== null && (
          <h4 style={{ marginBottom: "0.5rem", color: "#6366f1" }}>
            Time Taken: {Math.floor(attemptDuration / 60)}m {Math.round(attemptDuration % 60)}s
          </h4>
        )}

        <div className="miscue-chips">
          {metrics.map(m => (
            <span
              className={`chip ${m.color}`}
              key={`${initialPassageId}-${selectedAttemptIndex}-${m.key}`}
            >
              {miscueSummary[m.key] || 0} {m.label}
            </span>
          ))}
        </div>

        <div className="attempt-selector">
          <label htmlFor="attemptSelect">Select Attempt:</label>
          <select
            id="attemptSelect"
            value={selectedAttemptIndex}
            onChange={e => setSelectedAttemptIndex(Number(e.target.value))}
          >
            {filteredAttempts.map((_, idx) => (
              <option key={`attempt-${idx}`} value={idx}>
                Attempt {idx + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="highlighted-text-box side-by-side-layout">
          <div className="card-box">
            <h5>Original</h5>
            <p>{originalText}</p>
          </div>
          <div className="card-box">
            <h5>Student Attempt</h5>
            {highlightedContent?.trim() ? (
              <p dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            ) : rawAttempt?.trim() ? (
              <p>{rawAttempt}</p>
            ) : (
              <p>No attempt recorded.</p>
            )}
          </div>
        </div>

        <div className="audio-player-container">
          {audioUrl ? (
            <audio controls src={audioUrl}>
              Your browser does not support audio.
            </audio>
          ) : (
            <p>No audio available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassageView;
