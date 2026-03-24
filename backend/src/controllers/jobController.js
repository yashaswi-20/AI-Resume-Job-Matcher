const Job = require('../models/Job');
const { generateEmbedding } = require('../services/embeddingService');

/**
 * POST /api/jobs
 * Create a new job with a Gemini semantic embedding.
 */
const createJob = async (req, res) => {
  const { title, description, requiredSkills, location } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: '"title" and "description" are required.' });
  }

  // Combine title + skills + description for a richer embedding
  const textToEmbed = `${title}. ${description}. Skills: ${
    Array.isArray(requiredSkills) ? requiredSkills.join(', ') : ''
  }`;

  const embedding = await generateEmbedding(textToEmbed);

  const job = await Job.create({
    title,
    description,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
    location: location || 'Remote',
    embedding,
  });

  return res.status(201).json({
    success: true,
    message: 'Job created and embedded successfully.',
    data: {
      jobId: job._id,
      title: job.title,
      location: job.location,
      embeddingDimensions: embedding.length,
      createdAt: job.createdAt,
    },
  });
};

/**
 * GET /api/jobs
 * Return all jobs (without heavy embedding data).
 */
const getJobs = async (_req, res) => {
  const jobs = await Job.find({}, '-embedding').sort({ createdAt: -1 }).lean();
  return res.status(200).json({ success: true, count: jobs.length, data: jobs });
};

module.exports = { createJob, getJobs };
