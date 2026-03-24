const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate a semantic embedding vector for the given text
 * using Google's gemini-embedding-001 model.
 *
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} embedding vector
 */
async function generateEmbedding(text) {
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });

  if (!result || !result.embeddings || result.embeddings.length === 0) {
    throw new Error('Failed to generate embedding: empty response from Gemini');
  }

  return result.embeddings[0].values;
}

module.exports = { generateEmbedding };
