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

  const miscuesForPassage = useMemo(() => {
    const key = `${student.username}_${initialPassageId}`;
    return miscues.byStudentPassage.get(key) || [];
  }, [student.username, initialPassageId, miscues]);

  const miscuesForSelectedAttempt = miscuesForPassage[selectedAttemptIndex]?.result || {};

  const totalSummary = useMemo(() => {
    const totals = miscuesForPassage.reduce(
      (acc, m) => {
        const r = m.result;
        acc.numDels += r.numDels || 0;
        acc.numIns += r.numIns || 0;
        acc.numReps += r.numReps || 0;
        acc.numSubs += r.numSubs || 0;
        acc.numRevs += r.numRevs || 0;
        acc.numCorrect += r.numCorrect || 0;
        acc.totalWords +=
          (r.numCorrect || 0) + r.numDels + r.numIns + r.numReps + r.numSubs + r.numRevs;
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
    return totals;
  }, [miscuesForPassage]);

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

    const combinedPassage = attempt.readingAttempts
      .map((p) => p.readingContent)
      .join(" ")
      .trim();
    setOriginalText(combinedPassage || "No passage text available.");

    const highlights =
      miscuesForSelectedAttempt?.attemptWithMiscues
        ?.map(({ word, miscue }) => {
          if (miscue === "Omission") return `<span class="omission ghost-word">[${word}]</span>`;
          if (!word) return "";
          const className = miscue.toLowerCase().replace(" ", "-");
          return `<span class="${className}">${word}</span>`;
        })
        .join(" ") || "";

    const raw = attempt.readingAttempts.map((a) => a.rawAttempt || "").join(" ");
    setHighlightedContent(highlights);
    setRawAttempt(raw);

    const audioReference = attempt.readingAttempts?.[0]?.readingActionRecords?.find(
      (r) => r.audioReference
    )?.audioReference;
    setAudioUrl(audioReference ? `/recordings/${audioReference}` : "");

    const durationSeconds = parseFloat(attempt.timeOnTask);
    setAttemptDuration(isNaN(durationSeconds) ? null : Math.round(durationSeconds));

    trackEvent("attempt_loaded", `Attempt ${selectedAttemptIndex + 1}`);
  }, [
    selectedAttemptIndex,
    filteredAttempts,
    assessments,
    initialPassageId,
    miscuesForSelectedAttempt,
    trackEvent,
  ]);

  if (!attemptsLoaded) return <h2>Loading passage data...</h2>;

  const correctWords = miscuesForSelectedAttempt.numCorrect || 0;
  const totalCorrectWords = totalSummary.numCorrect;

  const metrics = [
    { key: "numDels", label: "Omissions", color: "yellow" },
    { key: "numIns", label: "Insertions", color: "blue" },
    { key: "numReps", label: "Repetitions", color: "purple" },
    { key: "numSubs", label: "Substitutions", color: "green" },
    { key: "numRevs", label: "Reversals", color: "red" },
  ];

  return (
    <div className="passage-view-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 className="title">
          Student: {student?.firstName} {student?.lastName || "Unnamed Student"}
        </h2>
        <button
          onClick={() => {
            trackEvent("back_click", "Back to Student Dashboard");
            navigate(`/students/${student._id?.$oid || student._id}`);
          }}
          style={{
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back to Student Dashboard
        </button>
      </div>

      <h4 style={{ marginTop: 0, color: "#0ea5e9" }}>
        Total Correct Words (all passages): {totalCorrectWords}
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
        <div
          className="passage-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2 style={{ margin: 0 }}>
            <strong>
              Passage: "
              {assessment?.readingContent?.readingMaterial?.passageTitle || "Untitled Passage"}”
            </strong>
          </h2>

          <div className="attempt-selector">
            <label htmlFor="passageSelect">Change Passage:</label>
            <select
              id="passageSelect"
              value={initialPassageId}
              onChange={(e) => {
                trackEvent("change_passage", `To Passage ${e.target.value}`);
                navigate(`/passages/${student.username}/${e.target.value}`);
              }}
              onMouseEnter={() => handleMouseEnter("Passage Dropdown")}
              onMouseLeave={() => handleMouseLeave("Passage Dropdown")}
            >
              {assessments
                .filter((assessment) => {
                  const assessmentId = assessment._id?.$oid || assessment._id;
                  return studentAllAttempts.some(
                    (attempt) => attempt.readingAssessmentId === assessmentId
                  );
                })
                .map((a) => (
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
            Time Taken: {Math.floor(attemptDuration / 60)}m{" "}
            {Math.round(attemptDuration % 60)}s
          </h4>
        )}

        <div className="miscue-chips">
          {metrics.map((m) => (
            <span
              className={`chip ${m.color}`}
              key={`${initialPassageId}-${selectedAttemptIndex}-${m.key}`}
            >
              {miscuesForSelectedAttempt[m.key] || 0} {m.label}
            </span>
          ))}
        </div>

        <div className="attempt-selector">
          <label htmlFor="attemptSelect">Select Attempt:</label>
          <select
            id="attemptSelect"
            value={selectedAttemptIndex}
            onChange={(e) => {
              trackEvent("change_attempt", `Attempt ${e.target.value}`);
              setSelectedAttemptIndex(Number(e.target.value));
            }}
            onMouseEnter={() => handleMouseEnter("Attempt Dropdown")}
            onMouseLeave={() => handleMouseLeave("Attempt Dropdown")}
          >
            {filteredAttempts.map((_, idx) => (
              <option key={`attempt-${idx}`} value={idx}>
                Attempt {idx + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="highlighted-text-box side-by-side-layout">
          <div
            className="card-box"
            onMouseEnter={() => handleMouseEnter("Original Passage")}
            onMouseLeave={() => handleMouseLeave("Original Passage")}
          >
            <h5>Original</h5>
            <p>{originalText}</p>
          </div>
          <div
            className="card-box"
            onMouseEnter={() => handleMouseEnter("Student Attempt")}
            onMouseLeave={() => handleMouseLeave("Student Attempt")}
          >
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

        <div
          className="audio-player-container"
          onMouseEnter={() => handleMouseEnter("Audio Player")}
          onMouseLeave={() => handleMouseLeave("Audio Player")}
        >
          {audioUrl ? (
            <audio
              controls
              src={audioUrl}
              onPlay={() => trackEvent("audio_play", "Audio Started")}
            >
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