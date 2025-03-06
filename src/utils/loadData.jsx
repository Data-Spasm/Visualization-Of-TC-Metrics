import { studentUser, attempt1, attempt2 } from '../data/trialData';
import { Student, OverallPerformance } from '../models/StudentModel';
import { ReadingAttempt } from '../models/ReadingAttemptModel';
import { ReadingSkills } from '../models/ReadingSkillsModel';
import { levenshteinDistance } from '../utils/levenshtein';
import { getPhoneticSimilarity } from '../utils/phonemeMapping';

function cleanWord(word) {
  return word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
}

function alignWords(contentWords, attemptWords) {
  const len1 = contentWords.length;
  const len2 = attemptWords.length;
  const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (contentWords[i - 1] === attemptWords[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + 1 // Substitution
        );
      }
    }
  }

  let i = len1;
  let j = len2;
  const alignedContentWords = [];
  const alignedAttemptWords = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && contentWords[i - 1] === attemptWords[j - 1]) {
      alignedContentWords.unshift(contentWords[i - 1]);
      alignedAttemptWords.unshift(attemptWords[j - 1]);
      i--;
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j] === matrix[i - 1][j] + 1)) {
      alignedContentWords.unshift(contentWords[i - 1]);
      alignedAttemptWords.unshift(null);
      i--;
    } else if (j > 0 && (i === 0 || matrix[i][j] === matrix[i][j - 1] + 1)) {
      alignedContentWords.unshift(null);
      alignedAttemptWords.unshift(attemptWords[j - 1]);
      j--;
    } else {
      alignedContentWords.unshift(contentWords[i - 1]);
      alignedAttemptWords.unshift(attemptWords[j - 1]);
      i--;
      j--;
    }
  }

  return { alignedContentWords, alignedAttemptWords };
}

function extractMisreadWords(readingAttempts) {
  const misreadWords = [];

  readingAttempts.forEach(attempt => {
    attempt.readingAttempts.forEach(record => {
      const contentWords = record.readingContent.split(' ').map(cleanWord);
      const attemptWords = record.rawAttempt.split(' ').map(cleanWord);

      const { alignedContentWords, alignedAttemptWords } = alignWords(contentWords, attemptWords);

      alignedContentWords.forEach((word, index) => {
        const attemptWord = alignedAttemptWords[index];
        if (word !== attemptWord) {
          const distance = levenshteinDistance(word || '', attemptWord || '');
          const similarity = getPhoneticSimilarity(word || '', attemptWord || '');

          console.log(`Actual word: ${word}, Raw word: ${attemptWord}, Distance: ${distance}, Similarity: ${similarity}`);

          if (distance > 0 && similarity < 1) {
            const existingWord = misreadWords.find(misread => misread.word === word);
            if (existingWord) {
              existingWord.count++;
            } else {
              misreadWords.push({ word: word, count: 1 });
            }
          }
        }
      });
    });
  });

  return misreadWords.sort((a, b) => b.count - a.count).slice(0, 10);
}

export function loadStudentData() {
  const performance = studentUser.student.reading.overallPerformance || {};

  const overallPerformance = new OverallPerformance(
    performance.overallAccuracy ?? 0,  // Use 0 if undefined
    performance.overallFluency ?? 0,
    performance.overallSubstitutions ?? 0,
    performance.overallInsertions ?? 0,
    performance.overallOmissions ?? 0,
    performance.overallRepetitions ?? 0,
    performance.overallReversals ?? 0,
    performance.overallRefWords ?? 0,
    performance.overallCorrect ?? 0,
    performance.overallTimeOnTask ?? 0
  );

  const readingAttempts = loadReadingAttempts();
  const misreadWords = extractMisreadWords(readingAttempts);

  return new Student(
    studentUser.id,
    studentUser.firstName,
    studentUser.lastName,
    studentUser.age,
    studentUser.username,
    studentUser.email,
    studentUser.country,
    studentUser.student.classLevel,
    studentUser.student.reading.readingLevel,
    overallPerformance,
    studentUser.loginTimes,
    studentUser.logoutTimes,
    studentUser.userLocales,
    studentUser.student.termsAccepted,
    studentUser.student.userSchool,
    studentUser.student.teacherName,
    studentUser.student.voiceGender,
    studentUser.student.reading.readingAssessmentAttemptIds,
    studentUser.student.reading.screeningSessionStatus,
    misreadWords // Add misread words to the student data
  );
}

export function loadReadingAttempts() {
  const attemptsData = [attempt1, attempt2];

  return attemptsData.map(attempt => new ReadingAttempt(
    attempt.id,
    attempt.studentUsername,
    attempt.title,
    attempt.readingAssessmentId,
    attempt.readingAttempts,
    attempt.dateAttempted,
    attempt.duration,
    attempt.timeOnTask,
    attempt.quit,
    attempt.type
  ));
}

export function loadReadingSkills() {
  if (!studentUser.student.reading.readingSkills) {
    console.error("Warning: Reading skills data is missing. Returning default values.");
    return new ReadingSkills([], [], []); // Return empty arrays instead of null
  }

  return new ReadingSkills(
    studentUser.student.reading.readingSkills.phonemicAwareness || [],
    studentUser.student.reading.readingSkills.phonics || [],
    studentUser.student.reading.readingSkills.fluency || []
  );
}