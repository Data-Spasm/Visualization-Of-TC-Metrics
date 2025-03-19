const calculateReadingScore = (students) => {
  if (!students || students.length === 0) return { classReadingScore: 0, overallPerformanceScore: 0 };

  let totalReadingScore = 0, totalStudentsWithScore = 0;

  students.forEach((student) => {
    // Calculate reading score based on overall performance metrics in the mock data
    if (student.overallPerformance) {
      const { accuracy, fluency, timeOnTask } = student.overallPerformance;

      // Example calculation, feel free to adjust this formula as needed
      const readingScore = (accuracy * 0.4) + (fluency * 0.4) + ((timeOnTask / 600) * 20);

      totalReadingScore += readingScore;
      totalStudentsWithScore++;
    }
  });

  const classReadingScore = totalStudentsWithScore > 0 ? (totalReadingScore / totalStudentsWithScore).toFixed(2) : 0;
  const overallPerformanceScore = classReadingScore; 

  return { classReadingScore, overallPerformanceScore };
};

export default calculateReadingScore;


