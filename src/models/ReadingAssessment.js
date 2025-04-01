// src/models/ReadingAssessmentModel.js
// This file is used to interact with the reading assessments data
import { readingAssessments } from '../utils/loadData';

class ReadingAssessment {
  static getAssessmentById(id) {
    return readingAssessments.find(assessment => assessment._id.$oid === id);
  }

  static getAllAssessments() {
    return readingAssessments;
  }
}

export default ReadingAssessment;
