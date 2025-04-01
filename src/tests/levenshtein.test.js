import { levenshteinDistance } from '../utils/levenshtein';

test('levenshteinDistance should return correct distance', () => {
  expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  expect(levenshteinDistance('flaw', 'lawn')).toBe(2);
  expect(levenshteinDistance('gumbo', 'gambol')).toBe(2);
  expect(levenshteinDistance('book', 'back')).toBe(2);
  expect(levenshteinDistance('kitten', 'kitten')).toBe(0);
});