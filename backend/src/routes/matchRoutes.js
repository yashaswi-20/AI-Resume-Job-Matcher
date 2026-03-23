const express = require('express');
const { matchResume } = require('../controllers/matchController');

const router = express.Router();

/**
 * GET /api/match/:resumeId
 * Returns top-10 job matches for the given resume
 */
router.get('/:resumeId', matchResume);

module.exports = router;
