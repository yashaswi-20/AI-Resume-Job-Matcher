/**
 * Cosine similarity between two dense vectors (arrays of numbers).
 *
 * @param {number[]} vecA - Embedding vector A
 * @param {number[]} vecB - Embedding vector B
 * @returns {number} similarity in [0, 1]  (clamped — embeddings are normalised)
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  const similarity = dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));

  // Clamp to [0, 1] — floating-point rounding can produce tiny negatives
  return Math.max(0, Math.min(1, similarity));
}

module.exports = { cosineSimilarity };
