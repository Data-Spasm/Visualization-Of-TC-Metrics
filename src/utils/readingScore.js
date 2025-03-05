const calculateReadingScore = (students) => {
    if (!students || students.length === 0) return { classReadingScore: 0, overallPerformanceScore: 0 };
  
    let totalAccuracy = 0, totalFluency = 0, count = 0;
  
    students.forEach((student) => {
      if (student.overallPerformance) {
        totalAccuracy += student.overallPerformance.accuracy || 0;
        totalFluency += student.overallPerformance.fluency || 0;
        count++;
      }
    });
  
    return {
      classReadingScore: count > 0 ? (totalAccuracy / count).toFixed(2) : 0,
      overallPerformanceScore: count > 0 ? (totalFluency / count).toFixed(2) : 0,
    };
  };
  
  export default calculateReadingScore;
  