import { ReadingAttempt, ReadingActionRecord, ReadingActionRecordDetails } from '../models/ReadingAttemptModel';

export class ReadingAttemptController {
  constructor() {
    this.readingAttempts = [];
  }

  addReadingAttempt(attemptData) {
    console.log("Adding reading attempt:", attemptData);

    const readingActionRecords = attemptData.readingAttempts.map(record => {
      const details = record.readingActionRecords.map(detail => new ReadingActionRecordDetails(
        detail.readingContent,
        detail.timestamp,
        detail.readingAssessmentId,
        detail._class,
        detail.audioReference
      ));

      return new ReadingActionRecord(
        record.readingContent,
        record.rawAttempt,
        record.duration,
        record.attempted,
        record.highlights,
        details
      );
    });

    const readingAttempt = new ReadingAttempt(
      attemptData.id,
      attemptData.studentUsername,
      attemptData.title,
      attemptData.readingAssessmentId,
      readingActionRecords,
      attemptData.dateAttempted,
      attemptData.duration,
      attemptData.timeOnTask,
      attemptData.quit,
      attemptData.type
    );

    this.readingAttempts.push(readingAttempt);
    console.log("Reading attempt added:", readingAttempt);
  }

  getReadingAttemptById(id) {
    return this.readingAttempts.find(attempt => attempt.id === id);
  }

  getAllReadingAttempts() {
    return this.readingAttempts;
  }
}