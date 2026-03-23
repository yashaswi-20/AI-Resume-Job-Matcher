const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract plain text from a resume buffer.
 *
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} mimetype - MIME type of the uploaded file
 * @returns {Promise<string>} Extracted text
 */
async function parseResume(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text.trim();
  }

  if (
    mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}

module.exports = { parseResume };
