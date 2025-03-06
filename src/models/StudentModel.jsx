export class Student {
  constructor(
    id,
    firstName,
    lastName,
    age,
    username,
    email,
    country,
    classLevel,
    readingLevel,
    overallPerformance,
    loginTimes,
    logoutTimes,
    userLocales,
    termsAccepted,
    userSchool,
    teacherName,
    voiceGender,
    readingAssessmentAttemptIds,
    screeningSessionStatus,
    misreadWords // Add misread words to the student model
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.username = username;
    this.email = email;
    this.country = country;
    this.classLevel = classLevel;
    this.readingLevel = readingLevel;
    this.overallPerformance = overallPerformance;
    this.loginTimes = loginTimes;
    this.logoutTimes = logoutTimes;
    this.userLocales = userLocales;
    this.termsAccepted = termsAccepted;
    this.userSchool = userSchool;
    this.teacherName = teacherName;
    this.voiceGender = voiceGender;
    this.readingAssessmentAttemptIds = readingAssessmentAttemptIds;
    this.screeningSessionStatus = screeningSessionStatus;
    this.misreadWords = misreadWords; // Initialize misread words
  }
}
  
  export class OverallPerformance {
    constructor(
      accuracy,
      fluency,
      substitutions,
      insertions,
      omissions,
      repetitions,
      reversals,
      refWords,
      correctWords,
      timeOnTask
    ) {
      this.accuracy = accuracy;
      this.fluency = fluency;
      this.substitutions = substitutions;
      this.insertions = insertions;
      this.omissions = omissions;
      this.repetitions = repetitions;
      this.reversals = reversals;
      this.refWords = refWords;
      this.correctWords = correctWords;
      this.timeOnTask = timeOnTask;
    }
  }