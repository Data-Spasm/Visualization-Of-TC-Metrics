// src/controllers/ReadingAttemptController.js
import ReadingAttempt from '../models/ReadingAttempt';

class ReadingAttemptController {
  // Get attempt details by ID
  static getAttemptById(id) {
    return ReadingAttempt.getAttemptById(id);
  }

  static getAllAttempts() {
    return ReadingAttempt.getAllAttempts();
  }

  // Get attempts made by a specific student
  static getAttemptsByStudent(username) {
    return ReadingAttempt.getAttemptsByStudent(username);
  }

  // Get attempts for a specific assessment
  static getAttemptsByAssessment(assessmentId) {
    return ReadingAttempt.getAttemptsByAssessment(assessmentId);
  }

  // Get all misread words (updated to accept optional readingAttempts)
  static getMisreadWords(readingAttempts = null) {
    if (readingAttempts) {
      return ReadingAttempt.getMisreadWords(readingAttempts); // pass to model
    }
    const allAttempts = ReadingAttempt.getAllAttempts();
    return ReadingAttempt.getMisreadWords(allAttempts);
  }

}

export default ReadingAttemptController;
