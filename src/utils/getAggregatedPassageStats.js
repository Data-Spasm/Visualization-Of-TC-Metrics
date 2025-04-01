export function getAggregatedPassageStats(studentUsername, allAttempts, assessments) {
    return assessments.map(assessment => {
      const passageId = assessment._id?.$oid || assessment._id;
      const title = assessment.readingContent?.readingMaterial?.passageTitle || "Untitled";
  
      let studentCorrect = 0;
      let studentAttempts = 0;
      let classCorrect = 0;
      let classAttempts = 0;
      let studentDels = 0;
      let studentSubs = 0;
  
      allAttempts.forEach(doc => {
        if (doc.readingAssessmentId !== passageId) return;
  
        const isStudent = doc.studentUsername === studentUsername;
  
        if (isStudent) studentAttempts += 1;
        classAttempts += 1;
  
        doc.readingAttempts?.forEach(seg => {
          if (!seg.attempted || !seg.rawAttempt || !seg.readingContent) return;
          const result = assessAttempt(seg.readingContent, seg.rawAttempt);
  
          if (isStudent) {
            studentCorrect += result.numCorrect || 0;
            studentDels += result.numDels || 0;
            studentSubs += result.numSubs || 0;
          }
  
          classCorrect += result.numCorrect || 0;
        });
      });
  
      const totalWords = studentCorrect + studentDels + studentSubs;
      const miscueRate = totalWords > 0 ? ((studentDels + studentSubs) / totalWords) * 100 : 0;
  
      return {
        passageId,
        passageTitle: title,
        studentCorrect,
        studentAttempts,
        classCorrect: classAttempts > 0 ? classCorrect / classAttempts : 0,
        classAttempts,
        miscueRate: +miscueRate.toFixed(2),
      };
    });
  }
  