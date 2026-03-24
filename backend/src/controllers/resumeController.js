const Resume = require('../models/Resume');
const { parseResume } = require('../services/resumeParser');
const { generateEmbedding } = require('../services/embeddingService');

/**
 * POST /api/resume/upload
 * Accepts a resume file (PDF or DOCX), extracts text,
 * generates a Gemini semantic embedding, and saves to MongoDB.
 */
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded. Field name must be "resume".' });
  }

  const { originalname, mimetype, buffer } = req.file;

  // 1. Extract text
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

  // 2. Generate Gemini embedding
  const embedding = await generateEmbedding(extractedText);

  // 3. Save resume
  const resume = await Resume.create({
    originalName: originalname,
    mimeType: mimetype,
    extractedText,
    embedding,
  });

  return res.status(201).json({
    success: true,
    message: 'Resume uploaded and embedded successfully.',
    data: {
      resumeId: resume._id,
      originalName: resume.originalName,
      textLength: extractedText.length,
      embeddingDimensions: embedding.length,
      createdAt: resume.createdAt,
    },
  });
};

module.exports = { uploadResume };
