import React, { createContext, useState, useEffect } from "react";
import UserController from "../controllers/User";
import ReadingAttemptController from "../controllers/ReadingAttempt";
import ReadingAssessmentController from "../controllers/ReadingAssessment";
import { assessAttempt } from "../utils/assessAttempt";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [readingAttempts, setReadingAttempts] = useState([]);
  const [miscues, setMiscues] = useState({ global: [], byStudentPassage: new Map() });

  const [loading, setLoading] = useState(true);
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);

  const teacherUsername = "arima2";

  // Load students and assessments
  useEffect(() => {
    try {
      const fetchedStudents = UserController.getStudentsByTeacher(teacherUsername);

      // fake names (temporary override)
      const fakeNames = [
        "Yohpie Smith",
        "Josiah Mayers",
        "Maia Paltoo",
        "Aaron Peters",
        "Bruno Mars",
        "Akeilah McKenzie",
      ];

      const renamed = fetchedStudents.map((s, i) => {
        const [firstName, lastName] = fakeNames[i]?.split(" ") || [s.firstName, s.lastName];
        return { ...s, firstName, lastName };
      });

      setStudents(renamed);

      const fetchedAssessments = ReadingAssessmentController.getAllAssessments();
      setAssessments(fetchedAssessments);

      setLoading(false);
    } catch (err) {
      console.error("Error loading initial data:", err);
      setLoading(false);
    }
  }, []);

  // Lazy load attempts + miscues on demand
  const loadAttemptsAndMiscues = () => {
    if (attemptsLoaded || students.length === 0) return;

    const allAttempts = ReadingAttemptController.getAllAttempts();
    const studentUsernames = students.map((s) => s.username);
    const filtered = allAttempts.filter((a) => studentUsernames.includes(a.studentUsername));

    const globalResults = [];
    const byStudentPassage = new Map();
    const cache = new Map();

    for (const attempt of filtered) {
      if (!Array.isArray(attempt.readingAttempts)) continue;

      for (const segment of attempt.readingAttempts) {
        if (!segment.readingContent || !segment.rawAttempt) continue;

        const cacheKey = `${segment.readingContent}|${segment.rawAttempt}`;
        if (!cache.has(cacheKey)) {
          cache.set(cacheKey, assessAttempt(segment.readingContent, segment.rawAttempt));
        }

        const result = cache.get(cacheKey);
        globalResults.push({
          readingContent: segment.readingContent,
          rawAttempt: segment.rawAttempt,
          result
        });

        const mapKey = `${attempt.studentUsername}_${attempt.readingAssessmentId}`;
        if (!byStudentPassage.has(mapKey)) byStudentPassage.set(mapKey, []);
        byStudentPassage.get(mapKey).push({ segment, result });
      }
    }

    setReadingAttempts(filtered);
    setMiscues({ global: globalResults, byStudentPassage });
    setAttemptsLoaded(true);
  };

  return (
    <DataContext.Provider
      value={{
        students,
        assessments,
        readingAttempts,
        miscues,
        loading,
        attemptsLoaded,
        loadAttemptsAndMiscues
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
