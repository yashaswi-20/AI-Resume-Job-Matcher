const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/jobs', () => {
  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ description: 'Some description' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if description is missing', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ title: 'Backend Engineer' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should create a job and return 201', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Backend Engineer',
      description: 'Node.js REST APIs MongoDB Express microservices',
      requiredSkills: ['Node.js', 'MongoDB'],
      location: 'Remote',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('jobId');
    expect(res.body.data.title).toBe('Backend Engineer');
  });
});

describe('GET /api/jobs', () => {
  it('should return a list of jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
