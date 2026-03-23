const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { generateVector } = require('../services/embeddingService');

/**
 * POST /api/jobs
 * Create a new job with full TF-IDF vector.
 * Corpus includes all existing resume texts for IDF consistency.
 */
const createJob = async (req, res) => {
  const { title, description, requiredSkills, location } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: '"title" and "description" are required.' });
  }

  // Fetch existing resume texts to build a shared corpus (IDF consistency)
  const existingResumes = await Resume.find({}, 'extractedText').lean();
  const corpusTexts = existingResumes.map((r) => r.extractedText);

  const vector = generateVector(description, corpusTexts);

  const job = await Job.create({
    title,
    description,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
    location: location || 'Remote',
    tfidfVector: vector,
  });

  return res.status(201).json({
    success: true,
    message: 'Job created and vectorized successfully.',
    data: {
      jobId: job._id,
      title: job.title,
      location: job.location,
      vectorTerms: Object.keys(vector).length,
      createdAt: job.createdAt,
    },
  });
};

/**
 * GET /api/jobs
 * Return all jobs (without heavy vector data).
 */
const getJobs = async (_req, res) => {
  const jobs = await Job.find({}, '-tfidfVector').sort({ createdAt: -1 }).lean();
  return res.status(200).json({ success: true, count: jobs.length, data: jobs });
};

module.exports = { createJob, getJobs };
