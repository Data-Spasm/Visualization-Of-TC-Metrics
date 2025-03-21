// src/controllers/UserController.js
import User from '../models/User';
import ReadingAttempt from '../models/ReadingAttempt';
import ReadingAssessment from '../models/ReadingAssessment';

class UserController {
  // Fetch user details by username
  static getUserByUsername(username) {
    return User.getUserByUsername(username);
  }

  // Fetch all students
  static getAllStudents() {
    return User.getUsersByRole("ROLE_STUDENT");
  }

  // Fetch all teachers
  static getAllTeachers() {
    return User.getUsersByRole("ROLE_TEACHER");
  }

  // Fetch reading attempts and related assessments for a student
  static getStudentReadingData(username) {
    const attempts = ReadingAttempt.getAttemptsByStudent(username);
    return attempts.map(attempt => ({
      ...attempt,
      assessment: ReadingAssessment.getAssessmentById(attempt.readingAssessmentId)
    }));
  }
}

export default UserController;