import API_BASE from "../utils/api";

const UserController = {
  async getUserByUsername(username) {
    const response = await fetch(`${API_BASE}/api/users/${username}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  async getAllStudents() {
    const response = await fetch(`${API_BASE}/api/users?role=ROLE_STUDENT`);
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  },

  async getAllTeachers() {
    const response = await fetch(`${API_BASE}/api/users?role=ROLE_TEACHER`);
    if (!response.ok) throw new Error("Failed to fetch teachers");
    return response.json();
  },

  async getStudentsByTeacher(username) {
    const response = await fetch(`${API_BASE}/api/users?teacher=${username}`);
    if (!response.ok) throw new Error("Failed to fetch students by teacher");
    return response.json();
  },

  async getStudentReadingData(username) {
    const [attemptsRes, assessmentsRes] = await Promise.all([
      fetch(`${API_BASE}/api/readingAssessmentAttempts?student=${username}`),
      fetch(`${API_BASE}/api/readingAssessments`)
    ]);

    if (!attemptsRes.ok || !assessmentsRes.ok) {
      throw new Error("Failed to fetch reading data");
    }

    const attempts = await attemptsRes.json();
    const assessments = await assessmentsRes.json();

    return attempts.map(attempt => ({
      ...attempt,
      assessment: assessments.find(
        a => a._id === attempt.readingAssessmentId || a._id?.$oid === attempt.readingAssessmentId
      )
    }));
  }
};

export default UserController;
