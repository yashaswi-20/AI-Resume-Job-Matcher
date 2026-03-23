const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { parseResume } = require('../services/resumeParser');
const { generateVector } = require('../services/embeddingService');


/**
 * POST /api/resume/upload
 * Accepts a resume file (PDF or DOCX), extracts text,
 * generates a TF-IDF vector using the full corpus for IDF consistency,
 * and saves the resume to MongoDB.
 */
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded. Field name must be "resume".' });
  }

  const { originalname, mimetype, buffer } = req.file;

  // 1. Extract text — catch parsing errors (corrupt / empty files) gracefully
  let extractedText;
  try {
    extractedText = await parseResume(buffer, mimetype);
  } catch (parseErr) {
    return res.status(422).json({
      success: false,
      error: `Failed to parse resume file: ${parseErr.message}`,
    });
  }
  if (!extractedText || extractedText.length < 10) {
    return res.status(422).json({ success: false, error: 'Could not extract meaningful text from the resume.' });
  }

  // 2. Fetch all existing job texts to build corpus context for consistent IDF
  const existingJobs = await Job.find({}, 'description').lean();
  const corpusTexts = existingJobs.map((j) => j.description);

  // 3. Generate TF-IDF vector
  const vector = generateVector(extractedText, corpusTexts);

  // 4. Save resume
  const resume = await Resume.create({
    originalName: originalname,
    mimeType: mimetype,
    extractedText,
    tfidfVector: vector,
  });

  return res.status(201).json({
    success: true,
    message: 'Resume uploaded and vectorized successfully.',
    data: {
      resumeId: resume._id,
      originalName: resume.originalName,
      textLength: extractedText.length,
      vectorTerms: Object.keys(vector).length,
      createdAt: resume.createdAt,
    },
  });
};

module.exports = { uploadResume };
