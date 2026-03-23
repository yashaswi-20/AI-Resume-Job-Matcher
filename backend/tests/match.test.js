const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Resume = require('../src/models/Resume');
const Job = require('../src/models/Job');

let resumeId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Seed a job
  await Job.create({
    title: 'Node.js Developer',
    description: 'build rest apis express nodejs mongodb backend services',
    requiredSkills: ['Node.js', 'Express'],
    location: 'Remote',
    tfidfVector: { nodejs: 0.7, express: 0.5, mongodb: 0.4, backend: 0.6 },
  });

  // Seed a resume with a similar vector
  const resume = await Resume.create({
    originalName: 'test-resume.pdf',
    mimeType: 'application/pdf',
    extractedText: 'nodejs express mongodb REST APIs backend engineer',
    tfidfVector: { nodejs: 0.8, express: 0.6, backend: 0.5, rest: 0.4 },
  });
  resumeId = resume._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/match/:resumeId', () => {
  it('should return 400 for an invalid resumeId format', async () => {
    const res = await request(app).get('/api/match/not-a-valid-id');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for a valid but non-existent resumeId', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/match/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 200 with ranked job matches for a valid resumeId', async () => {
    const res = await request(app).get(`/api/match/${resumeId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const match = res.body.data[0];
    expect(match).toHaveProperty('jobTitle');
    expect(match).toHaveProperty('similarityScore');
    expect(typeof match.similarityScore).toBe('number');
    expect(match.similarityScore).toBeGreaterThan(0);
    expect(match.similarityScore).toBeLessThanOrEqual(1);
  });

  it('should return jobs sorted by descending similarity score', async () => {
    const res = await request(app).get(`/api/match/${resumeId}`);
    const scores = res.body.data.map((m) => m.similarityScore);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
    }
  });
});
