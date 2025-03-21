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

  // Get all misread words
  static getMisreadWords() {
    return ReadingAttempt.getMisreadWords();
  }
}

export default ReadingAttemptController;
