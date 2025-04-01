import { getPhoneticSimilarity } from '../utils/phonemeMapping';

test('getPhoneticSimilarity should return correct similarity score', () => {
  expect(getPhoneticSimilarity('cat', 'bat')).toBeCloseTo(0.666, 2);
  expect(getPhoneticSimilarity('plant', 'plans')).toBeCloseTo(0.8, 2);
  expect(getPhoneticSimilarity('fish', 'fist')).toBeCloseTo(0.75, 2);
  expect(getPhoneticSimilarity('ship', 'chip')).toBeCloseTo(0.75, 2);
  expect(getPhoneticSimilarity('cat', 'cat')).toBe(1);
});