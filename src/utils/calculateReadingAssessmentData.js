const calculateReadingAssessmentData = (readingAttempts) => {
  if (!readingAttempts || readingAttempts.length === 0) {
    return [];
  }

  const weeklyData = new Map(); // Map to store weeks and passage counts

  readingAttempts.forEach((attempt) => {
    const attemptDate = new Date(attempt.date); // Ensure the attempt has a date field
    const weekNumber = getWeekNumber(attemptDate);

    if (!weeklyData.has(weekNumber)) {
      weeklyData.set(weekNumber, { week: `Week ${weekNumber}`, passagesPlayed: 0, passagesFinished: 0 });
    }

    const weekStats = weeklyData.get(weekNumber);
    weekStats.passagesPlayed++;

    if (!attempt.quit) {
      weekStats.passagesFinished++;
    }

    weeklyData.set(weekNumber, weekStats);
  });

  return Array.from(weeklyData.values()).sort((a, b) => a.week.localeCompare(b.week));
};

// Helper function to get the week number from a date
const getWeekNumber = (date) => {
  const start = new Date(date.getFullYear(), 0, 1); // Start of the year
  const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
};

export default calculateReadingAssessmentData;
