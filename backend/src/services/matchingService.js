const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { cosineSimilarity } = require('../utils/similarity');

/**
 * Match a resume against all jobs in the database.
 *
 * Flow:
 *  1. Fetch resume by ID (need its stored tfidfVector)
 *  2. Fetch all jobs that have a non-empty tfidfVector
 *  3. Compute cosine similarity between resume and each job
 *  4. Sort descending, return top 10
 *
 * Note: Vectors stored as Mongoose Maps — converted to plain objects first.
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

  const resumeVec = Object.fromEntries(resume.tfidfVector);

  if (Object.keys(resumeVec).length === 0) {
    const err = new Error('Resume has no TF-IDF vector. Please re-upload.');
    err.statusCode = 422;
    throw err;
  }

  const jobs = await Job.find({ tfidfVector: { $exists: true, $ne: {} } });

  if (jobs.length === 0) {
    return [];
  }

  const scored = jobs.map((job) => {
    const jobVec = Object.fromEntries(job.tfidfVector);
    const score = cosineSimilarity(resumeVec, jobVec);
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
