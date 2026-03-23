const express = require('express');
const upload = require('../middlewares/upload');
const { uploadResume } = require('../controllers/resumeController');

const router = express.Router();

/**
 * POST /api/resume/upload
 * Upload a resume file (PDF or DOCX)
 */
router.post('/upload', upload.single('resume'), uploadResume);

module.exports = router;
