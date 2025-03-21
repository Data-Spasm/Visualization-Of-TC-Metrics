import { levenshteinDistance } from "./levenshtein"; // Ensure this function exists
import { getPhoneticSimilarity } from "./phonemeMapping"; // Ensure this function exists

function cleanWord(word) {
  return word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
}

function alignWords(contentWords, attemptWords) {
  const len1 = contentWords.length;
  const len2 = attemptWords.length;
  const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

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

  let i = len1, j = len2;
  const alignedContentWords = [], alignedAttemptWords = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && contentWords[i - 1] === attemptWords[j - 1]) {
      alignedContentWords.unshift(contentWords[i - 1]);
      alignedAttemptWords.unshift(attemptWords[j - 1]);
      i--; j--;
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
      i--; j--;
    }
  }

  return { alignedContentWords, alignedAttemptWords };
}

export function extractMisreadWords(readingAttempts) {
  const misreadWords = [];

  readingAttempts.forEach(attempt => {
    attempt.readingAttempts.forEach(record => {
      const contentWords = record.readingContent.split(" ").map(cleanWord);
      const attemptWords = record.rawAttempt.split(" ").map(cleanWord);

      const { alignedContentWords, alignedAttemptWords } = alignWords(contentWords, attemptWords);

      alignedContentWords.forEach((word, index) => {
        const attemptWord = alignedAttemptWords[index];
        if (word && attemptWord && word !== attemptWord) { // Skip null values
          const distance = levenshteinDistance(word, attemptWord);
          const similarity = getPhoneticSimilarity(word, attemptWord);

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

  console.log("Extracted Misread Words:", misreadWords);
  return misreadWords.sort((a, b) => b.count - a.count).slice(0, 10);
}