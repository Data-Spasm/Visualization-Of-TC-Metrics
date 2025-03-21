// src/models/ReadingAttemptModel.js
// This file is used to interact with the reading assessment attempts data
import { readingAssessmentAttempts } from '../utils/loadData';
//import { extractMisreadWords } from '../utils/misreadWordsProcessor';

class ReadingAttempt {
  static getAttemptById(id) {
    return readingAssessmentAttempts.find(attempt => attempt._id.$oid === id);
  }

  static getAttemptsByStudent(username) {
    return readingAssessmentAttempts.filter(attempt => attempt.studentUsername === username);
  }

  static getAttemptsByAssessment(assessmentId) {
    return readingAssessmentAttempts.filter(attempt => attempt.readingAssessmentId === assessmentId);
  }

  static getAllAttempts() {
    return readingAssessmentAttempts;
  }

  // static getMisreadWords() {
  //   return extractMisreadWords(readingAssessmentAttempts);
  // }
}

export default ReadingAttempt;