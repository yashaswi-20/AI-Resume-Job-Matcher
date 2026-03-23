/**
 * Cosine similarity between two sparse vectors (plain JS objects).
 * Each vector is { term: score } — only shared terms contribute.
 *
 * @param {Object} vecA - { term: tfidfScore }
 * @param {Object} vecB - { term: tfidfScore }
 * @returns {number} similarity in [0, 1]
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // Dot product (only over shared keys — sparse optimisation)
  for (const term of Object.keys(vecA)) {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dotProduct += a * b;
    magnitudeA += a * a;
  }

  // Remaining magnitude of B (terms not in A)
  for (const term of Object.keys(vecB)) {
    if (!(term in vecA)) {
      magnitudeB += vecB[term] * vecB[term];
    } else {
      magnitudeB += vecB[term] * vecB[term];
    }
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

module.exports = { cosineSimilarity };
