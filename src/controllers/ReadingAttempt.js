const ReadingAttemptController = {
  // Get a single attempt by ID
  async getAttemptById(id) {
    const response = await fetch(`/api/readingAssessmentAttempts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch attempt by ID");
    return response.json();
  },

  // Get all attempts
  async getAllAttempts() {
    const response = await fetch(`/api/readingAssessmentAttempts`);
    if (!response.ok) throw new Error("Failed to fetch reading attempts");
    return response.json();
  },

  // Get attempts by student username
  async getAttemptsByStudent(username) {
    const response = await fetch(`/api/readingAssessmentAttempts?student=${username}`);
    if (!response.ok) throw new Error("Failed to fetch attempts by student");
    return response.json();
  },

  // Get attempts by assessment ID
  async getAttemptsByAssessment(assessmentId) {
    const response = await fetch(`/api/readingAssessmentAttempts?assessment=${assessmentId}`);
    if (!response.ok) throw new Error("Failed to fetch attempts by assessment");
    return response.json();
  },

};

export default ReadingAttemptController;
