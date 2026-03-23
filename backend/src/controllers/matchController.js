const { matchResumeToJobs } = require('../services/matchingService');

/**
 * GET /api/match/:resumeId
 * Returns top-10 job matches for a given resume, ranked by cosine similarity.
 */
const matchResume = async (req, res) => {
  const { resumeId } = req.params;
  const matches = await matchResumeToJobs(resumeId);

  return res.status(200).json({
    success: true,
    resumeId,
    totalMatches: matches.length,
    data: matches,
  });
};

module.exports = { matchResume };
