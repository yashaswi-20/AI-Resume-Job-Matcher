const { GoogleGenAI } = require('@google/genai');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

const getSuggestions = async (req, res) => {
  const { resumeId, jobId } = req.body;

  if (!resumeId || !jobId) {
    return res.status(400).json({ success: false, error: 'resumeId and jobId are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[SERVER ERROR] GEMINI_API_KEY is missing from environment. Verify your .env file.');
    return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is missing' });
  }

  try {
    // Exact same initialization as working script
    const ai = new GoogleGenAI({ apiKey });

    // Fetch texts
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

    const promptText = `
You are an expert technical recruiter. Provide 3-5 specific, actionable suggestions for this resume to match this job.
Job: ${job.title} - ${job.description}
Resume: ${resume.extractedText}
`;

    // Exact same method call structure as the user's working script
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: promptText,
    });

    console.log('[GEMINI SUCCESS] Suggestions generated');
    return res.status(200).json({
      success: true,
      data: response.text,
    });

  } catch (err) {
    console.error('[GEMINI ERROR DETAILED]', {
      message: err.message,
      status: err.status,
      data: err.data
    });

    return res.status(500).json({
      success: false,
      error: err.message || 'AI processing failed'
    });
  }
};

module.exports = { getSuggestions };
