import API_BASE from "../utils/api";

const ReadingAttemptController = {
  async getAttemptById(id) {
    const response = await fetch(`${API_BASE}/api/readingAssessmentAttempts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch attempt by ID");
    return response.json();
  },

  async getAllAttempts() {
    const response = await fetch(`${API_BASE}/api/readingAssessmentAttempts`);
    if (!response.ok) throw new Error("Failed to fetch reading attempts");
    return response.json();
  },

  async getAttemptsByStudent(username) {
    const response = await fetch(`${API_BASE}/api/readingAssessmentAttempts?student=${username}`);
    if (!response.ok) throw new Error("Failed to fetch attempts by student");
    return response.json();
  },

  async getAttemptsByAssessment(assessmentId) {
    const response = await fetch(`${API_BASE}/api/readingAssessmentAttempts?assessment=${assessmentId}`);
    if (!response.ok) throw new Error("Failed to fetch attempts by assessment");
    return response.json();
  }
};

export default ReadingAttemptController;
