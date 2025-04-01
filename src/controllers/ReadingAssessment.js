import API_BASE from "../utils/api";

const ReadingAssessmentController = {
  async getAssessmentById(id) {
    const response = await fetch(`${API_BASE}/api/readingAssessments/${id}`);
    if (!response.ok) throw new Error("Failed to fetch assessment by ID");
    return response.json();
  },

  async getAllAssessments() {
    const response = await fetch(`${API_BASE}/api/readingAssessments`);
    if (!response.ok) throw new Error("Failed to fetch assessments");
    return response.json();
  },

  async getAttemptsForAssessment(assessmentId) {
    const response = await fetch(`${API_BASE}/api/readingAssessmentAttempts?assessment=${assessmentId}`);
    if (!response.ok) throw new Error("Failed to fetch attempts for assessment");
    return response.json();
  }
};

export default ReadingAssessmentController;
