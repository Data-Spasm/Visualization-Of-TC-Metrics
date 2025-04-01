import { assessAttempt } from "./assessAttempt";

export function getClassroomAverages(allAssessmentAttempts = []) {
  const passageMap = {}; // { passageId: { totalCorrect, attempts } }

  allAssessmentAttempts.forEach(attempt => {
    const passageId = String(attempt.readingAssessmentId);

    if (!passageMap[passageId]) {
      passageMap[passageId] = { totalCorrect: 0, attempts: 0 };
    }

    // Compute total correct words across all segments in the attempt
    let totalCorrect = 0;
    if (Array.isArray(attempt.readingAttempts)) {
      attempt.readingAttempts.forEach(seg => {
        if (seg.attempted && seg.readingContent && seg.rawAttempt) {
          const { numCorrect = 0 } = assessAttempt(seg.readingContent, seg.rawAttempt);
          totalCorrect += numCorrect;
        }
      });
    }

    passageMap[passageId].totalCorrect += totalCorrect;
    passageMap[passageId].attempts += 1; // Only one attempt per student
  });

  return {
    classAverages: Object.entries(passageMap).map(([passageId, data]) => ({
      passageId,
      avgCorrect: data.attempts > 0 ? data.totalCorrect / data.attempts : 0,
      classAttempts: data.attempts,
    })),
  };
}
