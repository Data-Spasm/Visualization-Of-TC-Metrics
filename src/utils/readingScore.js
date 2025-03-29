const calculateReadingScore = (students) => {
  if (!students || students.length === 0) return { classReadingScore: 0, overallPerformanceScore: 0 };

  let totalReadingScore = 0,
    totalPerfScore = 0,
    totalStudentsWithScore = 0;

  students.forEach((student) => {
    const perf = student.student?.reading?.overallPerformance;

    if (perf) {
      const accuracy = perf.overallAccuracy * 100 || 0; // Assuming decimal (0.72) format
      const fluency = perf.overallFluency || 0;
      const timeOnTask = perf.overallTimeOnTask || 0;

      const readingScore = (accuracy * 0.4) + (fluency * 0.4) + ((timeOnTask / 600) * 20);
      const perfScore = (accuracy * 0.5) + (fluency * 0.5);

      totalReadingScore += readingScore;
      totalPerfScore += perfScore;
      totalStudentsWithScore++;
    }
  });

  const classReadingScore = totalStudentsWithScore > 0 ? (totalReadingScore / totalStudentsWithScore).toFixed(2) : 0;
  const overallPerformanceScore = totalStudentsWithScore > 0 ? (totalPerfScore / totalStudentsWithScore).toFixed(2) : 0;

  return { classReadingScore, overallPerformanceScore };
};

export default calculateReadingScore;

