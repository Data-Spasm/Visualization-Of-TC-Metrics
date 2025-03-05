import { ReadingAttemptController } from '../controllers/ReadingAttemptController';
import { levenshteinDistance } from '../utils/levenshtein';
import { getPhoneticSimilarity } from '../utils/phonemeMapping';

jest.mock('../utils/levenshtein');
jest.mock('../utils/phonemeMapping');

beforeEach(() => {
  levenshteinDistance.mockClear();
  getPhoneticSimilarity.mockClear();
});

test('ReadingAttemptController should track misread words correctly', () => {
  const controller = new ReadingAttemptController();
  const attemptData = {
    id: '1',
    studentUsername: 'student1',
    title: 'Test Attempt',
    readingAssessmentId: 'assessment1',
    readingAttempts: [
      {
        readingContent: 'Some plants have flowers for various functions.',
        rawAttempt: 'some plans have flowers for various functions',
        duration: 10,
        attempted: true,
        highlights: [],
        readingActionRecords: [
          {
            readingContent: 'Some plants have flowers for various functions.',
            timestamp: 1,
            readingAssessmentId: 'assessment1',
            _class: 'ReadingActionRecordDetails',
            audioReference: 'audio1'
          }
        ]
      }
    ],
    dateAttempted: '2025-03-04',
    duration: 10,
    timeOnTask: 10,
    quit: false,
    type: 'test'
  };

  // Mock the levenshteinDistance and getPhoneticSimilarity functions
  levenshteinDistance.mockImplementation((word1, word2) => {
    if (word1 === 'some' && word2 === 'some') return 0;
    if (word1 === 'plants' && word2 === 'plans') return 2;
    if (word1 === 'have' && word2 === 'have') return 0;
    if (word1 === 'flowers' && word2 === 'flowers') return 0;
    if (word1 === 'for' && word2 === 'for') return 0;
    if (word1 === 'various' && word2 === 'various') return 0;
    if (word1 === 'functions.' && word2 === 'functions') return 1;
    return 0;
  });
  getPhoneticSimilarity.mockImplementation((word1, word2) => {
    if (word1 === 'some' && word2 === 'some') return 1;
    if (word1 === 'plants' && word2 === 'plans') return 0.5;
    if (word1 === 'have' && word2 === 'have') return 1;
    if (word1 === 'flowers' && word2 === 'flowers') return 1;
    if (word1 === 'for' && word2 === 'for') return 1;
    if (word1 === 'various' && word2 === 'various') return 1;
    if (word1 === 'functions.' && word2 === 'functions') return 0.9;
    return 1;
  });

  controller.addReadingAttempt(attemptData, 'student1');
  const topMisreadWords = controller.getTopMisreadWords();

  expect(topMisreadWords).toEqual([
    { word: 'plants', count: 1, uniqueStudents: 1 }
  ]);
  expect(levenshteinDistance).toHaveBeenCalledWith('plants', 'plans');
  expect(getPhoneticSimilarity).toHaveBeenCalledWith('plants', 'plans');
});