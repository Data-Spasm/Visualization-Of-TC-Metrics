import assessAttempt from "../utils/assessAttempt"; 

export const getAttemptMiscues = (readingAttempts = []) => {
  return readingAttempts.map((attempt) => {
    const passage = attempt.referenceText;
    const transcript = attempt.studentTranscript;

    if (!passage || !transcript) return null;

    const result = assessAttempt(passage, transcript);

    return {
      id: attempt.id,
      substitutions: result.substitutions || 0,
      insertions: result.insertions || 0,
      omissions: result.omissions || 0,
      repetitions: result.repetitions || 0,
      selfCorrections: result.selfCorrections || 0,
      totalWords: result.totalWords || 1
    };
  }).filter(Boolean);
};
