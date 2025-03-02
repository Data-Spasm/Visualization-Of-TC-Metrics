import { studentUser, attempt1, attempt2 } from '../data/trialData';
import { Student, OverallPerformance } from '../models/StudentModel';
import { ReadingAttempt } from '../models/ReadingAttemptModel';
import { ReadingSkills } from '../models/ReadingSkillsModel';

export function loadStudentData() {
  const performance = studentUser.student.reading.overallPerformance || {};

  const overallPerformance = new OverallPerformance(
    performance.overallAccuracy ?? 0,  // Use 0 if undefined
    performance.overallFluency ?? 0,
    performance.overallSubstitutions ?? 0,
    performance.overallInsertions ?? 0,
    performance.overallOmissions ?? 0,
    performance.overallRepetitions ?? 0,
    performance.overallReversals ?? 0,
    performance.overallRefWords ?? 0,
    performance.overallCorrect ?? 0,
    performance.overallTimeOnTask ?? 0
  );

  return new Student(
    studentUser.id,
    studentUser.firstName,
    studentUser.lastName,
    studentUser.age,
    studentUser.username,
    studentUser.email,
    studentUser.country,
    studentUser.student.classLevel,
    studentUser.student.reading.readingLevel,
    overallPerformance,
    studentUser.loginTimes,
    studentUser.logoutTimes,
    studentUser.userLocales,
    studentUser.student.termsAccepted,
    studentUser.student.userSchool,
    studentUser.student.teacherName,
    studentUser.student.voiceGender,
    studentUser.student.reading.readingAssessmentAttemptIds,
    studentUser.student.reading.screeningSessionStatus
  );
}

export function loadReadingAttempts() {
  const attemptsData = [attempt1, attempt2];

  return attemptsData.map(attempt => new ReadingAttempt(
    attempt.id,
    attempt.studentUsername,
    attempt.title,
    attempt.readingAssessmentId,
    attempt.readingAttempts,
    attempt.dateAttempted,
    attempt.duration,
    attempt.timeOnTask,
    attempt.quit,
    attempt.type
  ));
}

export function loadReadingSkills() {
  if (!studentUser.student.reading.readingSkills) {
    console.error("Warning: Reading skills data is missing. Returning default values.");
    return new ReadingSkills([], [], []); // Return empty arrays instead of null
  }

  return new ReadingSkills(
    studentUser.student.reading.readingSkills.phonemicAwareness || [],
    studentUser.student.reading.readingSkills.phonics || [],
    studentUser.student.reading.readingSkills.fluency || []
  );
}