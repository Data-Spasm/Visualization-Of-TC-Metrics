import { Student, OverallPerformance } from '../models/StudentModel';

export class StudentController {
  constructor() {
    this.students = [];
  }

  addStudent(studentData) {
    const overallPerformance = new OverallPerformance(
      studentData.overallPerformance.accuracy,
      studentData.overallPerformance.fluency,
      studentData.overallPerformance.substitutions,
      studentData.overallPerformance.insertions,
      studentData.overallPerformance.omissions,
      studentData.overallPerformance.repetitions,
      studentData.overallPerformance.reversals,
      studentData.overallPerformance.refWords,
      studentData.overallPerformance.correctWords,
      studentData.overallPerformance.timeOnTask
    );

    const student = new Student(
      studentData.id,
      studentData.firstName,
      studentData.lastName,
      studentData.age,
      studentData.username,
      studentData.email,
      studentData.country,
      studentData.classLevel,
      studentData.readingLevel,
      overallPerformance,
      studentData.loginTimes,
      studentData.logoutTimes,
      studentData.userLocales,
      studentData.termsAccepted,
      studentData.userSchool,
      studentData.teacherName,
      studentData.voiceGender,
      studentData.readingAssessmentAttemptIds,
      studentData.screeningSessionStatus
    );

    this.students.push(student);
  }

  getStudentById(id) {
    return this.students.find(student => student.id === id);
  }

  getAllStudents() {
    return this.students;
  }
}