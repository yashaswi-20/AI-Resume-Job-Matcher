const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { cosineSimilarity } = require('../utils/similarity');
const { generateEmbedding } = require('./embeddingService');

/**
 * Match a resume against all jobs using Gemini semantic embeddings.
 *
 * Unlike TF-IDF, Gemini embeddings are absolute — they capture the
 * meaning of text regardless of what other documents exist. This means:
 *  - Stored embeddings remain valid when new jobs are added
 *  - "Memory management" and "Virtual Memory Simulator" are recognised
 *    as semantically related, even without shared keywords
 *
 * Flow:
 *  1. Fetch resume (use stored embedding, or generate if missing)
 *  2. Fetch all jobs with embeddings
 *  3. Compute cosine similarity between resume and each job
 *  4. Sort descending, return top 10
 *
 * @param {string} resumeId
 * @returns {Promise<Array<{ jobId, jobTitle, location, similarityScore }>>}
 */
async function matchResumeToJobs(resumeId) {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    const err = new Error('Resume not found');
    err.statusCode = 404;
    throw err;
  }

  // Use stored embedding, or generate one on-the-fly if missing
  let resumeEmbedding = resume.embedding;
  if (!resumeEmbedding || resumeEmbedding.length === 0) {
    if (!resume.extractedText || resume.extractedText.length < 10) {
      const err = new Error('Resume has no usable text. Please re-upload.');
      err.statusCode = 422;
      throw err;
    }
    resumeEmbedding = await generateEmbedding(resume.extractedText);
    // Save it for future use
    resume.embedding = resumeEmbedding;
    await resume.save();
  }

  const jobs = await Job.find({ embedding: { $exists: true, $not: { $size: 0 } } });

  if (jobs.length === 0) {
    return [];
  }

  const scored = jobs.map((job) => {
    const score = cosineSimilarity(resumeEmbedding, job.embedding);
    return {
      jobId: job._id,
      jobTitle: job.title,
      location: job.location,
      requiredSkills: job.requiredSkills,
      similarityScore: parseFloat(score.toFixed(4)),
    };
  });

  // Sort descending by score, return top 10
  return scored.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 10);
}

module.exports = { matchResumeToJobs };
