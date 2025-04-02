import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import ReadingProgressRadialCard from "../components/radial/ReadingProgressRadial";
import useAnalyticsEvent from "../hooks/useAnalyticsEvent";
import "./PassageView.css";

const PassageView = ({ student, passageId: initialPassageId }) => {
  const navigate = useNavigate();
  const {
    assessments,
    miscues,
    readingAttempts,
    attemptsLoaded,
    loadAttemptsAndMiscues,
  } = useContext(DataContext);

  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);
  const [highlightedContent, setHighlightedContent] = useState("");
  const [rawAttempt, setRawAttempt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [originalText, setOriginalText] = useState("Loading...");
  const [attemptDuration, setAttemptDuration] = useState(null);

  const trackEvent = useAnalyticsEvent("Passage View");
  const hoverStartRef = useRef({});

  useEffect(() => {
    if (!attemptsLoaded) loadAttemptsAndMiscues();
  }, [attemptsLoaded, loadAttemptsAndMiscues]);

  const handleMouseEnter = (label) => {
    hoverStartRef.current[label] = Date.now();
    trackEvent("hover_start", label);
  };

  const handleMouseLeave = (label) => {
    const start = hoverStartRef.current[label];
    if (start) {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEvent("hover_end", label, duration);
      delete hoverStartRef.current[label];
    }
  };

  const studentAllAttempts = useMemo(() => {
    return readingAttempts.filter((a) => a.studentUsername === student.username);
  }, [readingAttempts, student.username]);

  const filteredAttempts = useMemo(() => {
    return studentAllAttempts.filter((a) => a.readingAssessmentId === initialPassageId);
  }, [studentAllAttempts, initialPassageId]);

  const totalSummary = useMemo(() => {
    const allMiscues = [];

    assessments.forEach((a) => {
      const key = `${student.username}_${a._id?.$oid || a._id}`;
      const entries = miscues.byStudentPassage.get(key);
      if (entries) {
        allMiscues.push(...entries);
      }
    });

    return allMiscues.reduce(
      (acc, m) => {
        const r = m.result || {};
        acc.numDels += r.numDels || 0;
        acc.numIns += r.numIns || 0;
        acc.numReps += r.numReps || 0;
        acc.numSubs += r.numSubs || 0;
        acc.numRevs += r.numRevs || 0;
        acc.numCorrect += r.numCorrect || 0;
        acc.totalWords +=
          (r.numCorrect || 0) + (r.numDels || 0) + (r.numIns || 0) + (r.numReps || 0) + (r.numSubs || 0) + (r.numRevs || 0);
        return acc;
      },
      {
        numDels: 0,
        numIns: 0,
        numReps: 0,
        numSubs: 0,
        numRevs: 0,
        numCorrect: 0,
        totalWords: 0,
      }
    );
  }, [assessments, miscues, student.username]);

  useEffect(() => {
    setSelectedAttemptIndex(0);
  }, [initialPassageId]);

  useEffect(() => {
    if (!filteredAttempts.length || !assessments.length) return;

    const attempt = filteredAttempts[selectedAttemptIndex];
    const matchedAssessment = assessments.find(
      (a) => a._id?.$oid === initialPassageId || a._id === initialPassageId
    );
    setAssessment(matchedAssessment);

    const combinedPassage = attempt.readingAttempts.map((p) => p.readingContent).join(" ").trim();
    setOriginalText(combinedPassage || "No passage text available.");

    const allSegments = attempt.readingAttempts.filter(seg => seg.miscueResult);
    const allMiscueWords = allSegments.flatMap(seg => seg.miscueResult.attemptWithMiscues || []);

    const highlights = allMiscueWords.map(({ word, miscue }) => {
      if (miscue === "Omission") return `<span class="omission ghost-word">[${word}]</span>`;
      if (!word) return "";
      const className = miscue.toLowerCase().replace(" ", "-");
      return `<span class="${className}">${word}</span>`;
    }).join(" ");

    const raw = allSegments.map(seg => seg.rawAttempt || "").join(" ").trim();
    setHighlightedContent(highlights);
    setRawAttempt(raw);

    const audioReference = attempt.readingAttempts?.[0]?.readingActionRecords?.find(
      (r) => r.audioReference
    )?.audioReference;
    setAudioUrl(audioReference ? `/recordings/${audioReference}` : "");

    const durationSeconds = parseFloat(attempt.timeOnTask);
    setAttemptDuration(isNaN(durationSeconds) ? null : Math.round(durationSeconds));
    trackEvent("attempt_loaded", `Attempt ${selectedAttemptIndex + 1}`);
  }, [selectedAttemptIndex, filteredAttempts, assessments, initialPassageId, trackEvent]);

  if (!attemptsLoaded) return <h2>Loading passage data...</h2>;

  const attempt = filteredAttempts[selectedAttemptIndex];
  const combinedResult = attempt?.readingAttempts?.reduce(
    (acc, segment) => {
      const res = segment?.miscueResult || {};
      acc.numCorrect += res.numCorrect || 0;
      acc.numSubs += res.numSubs || 0;
      acc.numRevs += res.numRevs || 0;
      acc.numDels += res.numDels || 0;
      acc.numIns += res.numIns || 0;
      acc.numReps += res.numReps || 0;
      return acc;
    },
    {
      numCorrect: 0,
      numSubs: 0,
      numRevs: 0,
      numDels: 0,
      numIns: 0,
      numReps: 0,
    }
  );

  const metrics = [
    { key: "numSubs", label: "Substitutions", color: "red" },
    { key: "numRevs", label: "Reversals", color: "orange" },
    { key: "numDels", label: "Omissions", color: "yellow" },
    { key: "numIns", label: "Insertions", color: "lightblue" },
    { key: "numReps", label: "Repetitions", color: "indigo" },
  ];

  return (
    <div className="passage-view-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 className="title">
          Student: {student?.firstName} {student?.lastName || "Unnamed Student"}
        </h2>
        <button
        onClick={() => {
            trackEvent("back_click", "Back to Student Dashboard");
            navigate(`/students/${student._id?.$oid || student._id}`);
        }}
        style={{
            backgroundColor: "#1f2937", // Slate-800
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#374151")} // Hover: Slate-700
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1f2937")}
        >
        Back to Student Dashboard
        </button>

      </div>

      <h4 style={{ marginTop: 0, color: "#0ea5e9" }}>
        Total Correct Words (all passages): {totalSummary.numCorrect}
      </h4>

      <ReadingProgressRadialCard
        miscues={[
          {
            passageTitle: "All Passages",
            ...totalSummary,
          },
        ]}
      />

      <div className="passage-box">
        <div className="passage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>
            <strong>
              Passage: "{assessment?.readingContent?.readingMaterial?.passageTitle || "Untitled Passage"}”
            </strong>
          </h2>
          <div className="attempt-selector">
            <label htmlFor="passageSelect">Change Passage:</label>
            <select
              id="passageSelect"
              value={initialPassageId}
              onChange={(e) => navigate(`/passages/${student.username}/${e.target.value}`)}
            >
              {assessments
                .filter((a) => studentAllAttempts.some((att) => att.readingAssessmentId === (a._id?.$oid || a._id)))
                .map((a) => (
                  <option key={a._id?.$oid || a._id} value={a._id?.$oid || a._id}>
                    {a.readingContent?.readingMaterial?.passageTitle || "Untitled Passage"}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <h4 style={{ marginBottom: "0.5rem", color: "#059669" }}>
          Correct Words: {combinedResult.numCorrect}
        </h4>

        {attemptDuration !== null && (
          <h4 style={{ marginBottom: "0.5rem", color: "#6366f1" }}>
            Time Taken: {Math.floor(attemptDuration / 60)}m {Math.round(attemptDuration % 60)}s
          </h4>
        )}

        <div className="miscue-chips">
          {metrics.map((m) => (
            <span className={`chip ${m.color}`} key={`${initialPassageId}-${selectedAttemptIndex}-${m.key}`}>
              {combinedResult[m.key] || 0} {m.label}
            </span>
          ))}
        </div>

        <div className="attempt-selector">
          <label htmlFor="attemptSelect">Select Attempt:</label>
          <select
            id="attemptSelect"
            value={selectedAttemptIndex}
            onChange={(e) => setSelectedAttemptIndex(Number(e.target.value))}
          >
            {filteredAttempts.map((_, idx) => (
              <option key={`attempt-${idx}`} value={idx}>
                Attempt {idx + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="highlighted-text-box side-by-side-layout">
          <div className="card-box" onMouseEnter={() => handleMouseEnter("Original Passage")} onMouseLeave={() => handleMouseLeave("Original Passage")}>
            <h5>Original</h5><p>{originalText}</p>
          </div>
          <div className="card-box" onMouseEnter={() => handleMouseEnter("Student Attempt")} onMouseLeave={() => handleMouseLeave("Student Attempt")}>
            <h5>Student Attempt</h5>
            {highlightedContent ? <p dangerouslySetInnerHTML={{ __html: highlightedContent }} /> : rawAttempt ? <p>{rawAttempt}</p> : <p>No attempt recorded.</p>}
          </div>
        </div>

        <div className="audio-player-container" onMouseEnter={() => handleMouseEnter("Audio Player")} onMouseLeave={() => handleMouseLeave("Audio Player")}>
          {audioUrl ? (
            <audio controls src={audioUrl} onPlay={() => trackEvent("audio_play", "Audio Started")}>Your browser does not support audio.</audio>
          ) : (
            <p>No audio available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassageView;