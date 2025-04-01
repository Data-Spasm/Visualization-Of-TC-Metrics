export class ReadingAttempt {
    constructor(id, studentUsername, title, readingAssessmentId, readingAttempts, dateAttempted, duration, timeOnTask, quit, type) {
      this.id = id;
      this.studentUsername = studentUsername;
      this.title = title;
      this.readingAssessmentId = readingAssessmentId;
      this.readingAttempts = readingAttempts; // Array of ReadingActionRecords
      this.dateAttempted = dateAttempted;
      this.duration = duration;
      this.timeOnTask = timeOnTask;
      this.quit = quit;
      this.type = type;
    }
  }
  
  export class ReadingActionRecord {
    constructor(readingContent, rawAttempt, duration, attempted, highlights, readingActionRecords) {
      this.readingContent = readingContent;
      this.rawAttempt = rawAttempt;
      this.duration = duration;
      this.attempted = attempted;
      this.highlights = highlights;
      this.readingActionRecords = readingActionRecords; // Array of ReadingActionRecordDetails
    }
  }
  
  export class ReadingActionRecordDetails {
    constructor(readingContent, timestamp, readingAssessmentId, _class, audioReference = null) {
      this.readingContent = readingContent;
      this.timestamp = timestamp;
      this.readingAssessmentId = readingAssessmentId;
      this._class = _class;
      this.audioReference = audioReference;
    }
  }