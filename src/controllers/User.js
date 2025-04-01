const UserController = {
  // Get a user by username
  async getUserByUsername(username) {
    const response = await fetch(`/api/users/${username}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  // Get all students
  async getAllStudents() {
    const response = await fetch(`/api/users?role=ROLE_STUDENT`);
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  },

  // Get all teachers
  async getAllTeachers() {
    const response = await fetch(`/api/users?role=ROLE_TEACHER`);
    if (!response.ok) throw new Error("Failed to fetch teachers");
    return response.json();
  },

  // Get all students for a given teacher
  async getStudentsByTeacher(username) {
    const response = await fetch(`/api/users?teacher=${username}`);
    if (!response.ok) throw new Error("Failed to fetch students by teacher");
    return response.json();
  },

  // Get reading attempts + assessments for a student
  async getStudentReadingData(username) {
    const [attemptsRes, assessmentsRes] = await Promise.all([
      fetch(`/api/readingAssessmentAttempts?student=${username}`),
      fetch(`/api/readingAssessments`)
    ]);

    if (!attemptsRes.ok || !assessmentsRes.ok) {
      throw new Error("Failed to fetch reading data");
    }

    const attempts = await attemptsRes.json();
    const assessments = await assessmentsRes.json();

    return attempts.map(attempt => ({
      ...attempt,
      assessment: assessments.find(a => a._id === attempt.readingAssessmentId || a._id?.$oid === attempt.readingAssessmentId)
    }));
  }
};

export default UserController;
