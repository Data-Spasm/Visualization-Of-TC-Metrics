const calculateReadingAssessmentData = (readingAttempts) => {
    if (!readingAttempts || readingAttempts.length === 0) {
      return { numberOfStudents: 0, numberOfPassages: 0, passagesPlayed: 0, passagesFinished: 0 };
    }
  
    const studentSet = new Set();
    const passageSet = new Set();
    let passagesPlayed = readingAttempts.length;
    let passagesFinished = 0;
  
    readingAttempts.forEach((attempt) => {
      studentSet.add(attempt.studentUsername);
      passageSet.add(attempt.readingAssessmentId);
      if (!attempt.quit) passagesFinished++;
    });
  
    return {
      numberOfStudents: studentSet.size,
      numberOfPassages: passageSet.size,
      passagesPlayed,
      passagesFinished,
    };
  };
  
  export default calculateReadingAssessmentData;