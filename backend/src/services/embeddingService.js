const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const stopwords = natural.stopwords;

/**
 * Preprocess text: lowercase, tokenize, remove stopwords & short tokens.
 * @param {string} text
 * @returns {string} space-joined cleaned tokens
 */
function preprocess(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  return tokens
    .filter((t) => t.length > 2 && !stopwords.includes(t))
    .join(' ');
}

/**
 * Generate a TF-IDF sparse vector for a single document
 * given the full corpus of documents.
 *
 * Strategy:
 *  1. Build a TfIdf instance with all corpus documents + the target doc
 *  2. Extract term scores for the target doc (last index)
 *  3. Return as a plain { term: score } object
 *
 * Rebuilding from all documents each time ensures IDF weights are
 * globally consistent — identical to how the startup rebuild works.
 *
 * @param {string} targetText - The document to vectorize
 * @param {string[]} corpusTexts - All other documents in the corpus
 * @returns {{ [term: string]: number }} sparse TF-IDF vector
 */
function generateVector(targetText, corpusTexts = []) {
  const tfidf = new natural.TfIdf();

  // Add corpus documents first so IDF is correct
  for (const doc of corpusTexts) {
    tfidf.addDocument(preprocess(doc));
  }

  // Add the target document last
  const processed = preprocess(targetText);
  tfidf.addDocument(processed);

  const targetIdx = corpusTexts.length; // last index
  const vector = {};

  tfidf.listTerms(targetIdx).forEach(({ term, tfidf: score }) => {
    if (score > 0) {
      vector[term] = score;
    }
  });

  return vector;
}

module.exports = { generateVector, preprocess };
