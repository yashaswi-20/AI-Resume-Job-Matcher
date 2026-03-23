const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');

const router = express.Router();

/**
 * POST /api/jobs   - Create a new job listing
 * GET  /api/jobs   - List all jobs
 */
router.post('/', createJob);
router.get('/', getJobs);

module.exports = router;
