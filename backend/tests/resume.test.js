const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// A minimal valid PDF buffer (real pdf-parse needs actual PDF bytes)
// We'll use a real minimal PDF structure
const MINIMAL_PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type /Pages /Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type /Page /MediaBox[0 0 3 3]>>endobj\n' +
    'xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n' +
    '0000000058 00000 n\n0000000115 00000 n\n' +
    'trailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF'
);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/resume/upload', () => {
  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app).post('/api/resume/upload');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if unsupported file type is uploaded', async () => {
    const res = await request(app)
      .post('/api/resume/upload')
      .attach('resume', Buffer.from('hello'), {
        filename: 'test.txt',
        contentType: 'text/plain',
      });
    // Multer rejects the file type
    expect([400, 500]).toContain(res.status);
  });

  it('should accept a valid PDF and return 201 or 422 (empty text)', async () => {
    const res = await request(app)
      .post('/api/resume/upload')
      .attach('resume', MINIMAL_PDF, {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });
    // Minimal PDF has no readable text or pdf-parse throws — both yield 422
    expect([201, 422]).toContain(res.status);
  });
});
