const ReadingAssessmentController = {
  // Get a single assessment by ID
  async getAssessmentById(id) {
    const response = await fetch(`/api/readingAssessments/${id}`);
    if (!response.ok) throw new Error("Failed to fetch assessment by ID");
    return response.json();
  },

  // Get all assessments
  async getAllAssessments() {
    const response = await fetch(`/api/readingAssessments`);
    if (!response.ok) throw new Error("Failed to fetch assessments");
    return response.json();
  },

  //  Get all attempts linked to a specific assessment
  async getAttemptsForAssessment(assessmentId) {
    const response = await fetch(`/api/readingAssessmentAttempts?assessment=${assessmentId}`);
    if (!response.ok) throw new Error("Failed to fetch attempts for assessment");
    return response.json();
  }
};

export default ReadingAssessmentController;
