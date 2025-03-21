// src/controllers/ReadingAssessmentController.js
import ReadingAssessment from '../models/ReadingAssessment';
import ReadingAttempt from '../models/ReadingAttempt';

class ReadingAssessment {
  // Get a reading assessment by ID
  static getAssessmentById(id) {
    return ReadingAssessment.getAssessmentById(id);
  }

  // Get all reading assessments
  static getAllAssessments() {
    return ReadingAssessment.getAllAssessments();
  }

  // Get attempts for a specific assessment
  static getAttemptsForAssessment(assessmentId) {
    return ReadingAttempt.getAttemptsByAssessment(assessmentId);
  }
}

export default ReadingAssessment;
