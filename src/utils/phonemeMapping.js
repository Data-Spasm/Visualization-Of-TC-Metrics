export const phonemeMap = {
    "th": ["s", "f", "dh", "t"],
    "d": ["t", "b", "g"],
    "p": ["b", "t", "k"],
    "s": ["sh", "z"],
    "f": ["v", "th"],
    "n": ["m", "ng"],
    "r": ["l"],
    "v": ["f"],
    "k": ["g"],
    "sh": ["s", "ch"],
    "z": ["s"],
    "ch": ["sh", "j"],  // Added
    "b": ["p", "d"],         // Added
};

  
export function getPhoneticSimilarity(word1, word2) {
    const w1 = word1.toLowerCase();
    const w2 = word2.toLowerCase();
    let similarityScore = 0;
    const minLength = Math.min(w1.length, w2.length);

    for (let i = 0; i < minLength; i++) {
        if (w1[i] === w2[i]) {
            similarityScore += 1; // Exact match
        } else if (
            (phonemeMap[w1[i]] && phonemeMap[w1[i]].includes(w2[i])) ||
            (phonemeMap[w2[i]] && phonemeMap[w2[i]].includes(w1[i]))
        ) {
            similarityScore += 0.5; // Phoneme similarity only when defined
        }
    }

    return similarityScore / minLength; // Normalize score correctly
}
