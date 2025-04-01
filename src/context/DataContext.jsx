import React, { createContext, useState, useEffect } from "react";
import UserController from "../controllers/User";
import ReadingAttemptController from "../controllers/ReadingAttempt";
import ReadingAssessmentController from "../controllers/ReadingAssessment";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [readingAttempts, setReadingAttempts] = useState([]);
  const [miscues, setMiscues] = useState({ global: [], byStudentPassage: new Map() });

  const [loading, setLoading] = useState(true);
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);
  const teacherUsername = "arima2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStudents = await UserController.getStudentsByTeacher(teacherUsername);

        const fakeNames = [
          "Yophi Smith", "Josiah Mayers", "Maia Paltoo",
          "Aaron Peters", "Bruno Mars", "Akeilah McKenzie"
        ];

        const renamed = fetchedStudents.map((s, i) => {
          const [firstName, lastName] = fakeNames[i]?.split(" ") || [s.firstName, s.lastName];
          return { ...s, firstName, lastName };
        });

        setStudents(renamed);

        const fetchedAssessments = await ReadingAssessmentController.getAllAssessments();
        setAssessments(fetchedAssessments);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadAttemptsAndMiscues = async () => {
    if (attemptsLoaded || students.length === 0) return;
  
    try {
      const allAttempts = await ReadingAttemptController.getAllAttempts();
      const studentUsernames = students.map((s) => s.username);
      const filtered = allAttempts.filter((a) => studentUsernames.includes(a.studentUsername));
  
      const globalResults = [];
      const byStudentPassage = new Map();
  
      for (const attempt of filtered) {
        if (!Array.isArray(attempt.readingAttempts)) continue;
  
        for (const segment of attempt.readingAttempts) {
          const result = segment.miscueResult;
  
          if (
            !segment.readingContent ||
            !segment.rawAttempt ||
            !result ||
            typeof result.numCorrect === "undefined"
          ) continue;
  
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
    } catch (err) {
      console.error("Error loading attempts:", err);
    }
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
