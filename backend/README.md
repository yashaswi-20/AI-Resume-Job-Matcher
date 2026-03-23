# AI Resume–Job Matcher

A production-quality backend service that matches resumes to job descriptions using **TF-IDF vectorization** and **cosine similarity** — 100% free, no API keys required.

---

## Architecture

```
Client (HTTP)
    ↓
Express API Server  (server.js)
    ↓
Controllers  →  Services  →  MongoDB (Mongoose)
    ↓               ↓
Upload (Multer)   TF-IDF Vectorization (natural)
                  Resume Parser (pdf-parse / mammoth)
                  Cosine Similarity Matching
```

---

## How Embeddings Work (TF-IDF)

Instead of calling an external AI API, we use **Term Frequency–Inverse Document Frequency (TF-IDF)**:

| Concept | Meaning |
|---------|---------|
| **TF** | How often a word appears in *this* document |
| **IDF** | How rare the word is across *all* documents |
| **TF-IDF score** | High for words that are unique to a document |

Each resume and job gets a **sparse vector** `{ term: score }` stored in MongoDB. Common words like "the", "and" are automatically filtered out.

### IDF Consistency

On each vectorization, we pass the full corpus of existing documents so IDF weights are globally consistent — identical scores whether the server just started or has been running for days.

---

## How Cosine Similarity Works

Given two sparse vectors **A** (resume) and **B** (job):

```
similarity = (A · B) / (|A| × |B|)
```

- Score = **1.0** → identical vocabulary
- Score = **0.0** → no shared terms
- Only shared terms contribute (sparse optimization)

Jobs are ranked by descending similarity; top 10 are returned.

---

## API Endpoints

### POST `/api/resume/upload`
Upload a resume file (PDF or DOCX).

```bash
curl -X POST http://localhost:3000/api/resume/upload \
  -F "resume=@my_cv.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumeId": "65f3a...",
    "originalName": "my_cv.pdf",
    "textLength": 1842,
    "vectorTerms": 134
  }
}
```

---

### POST `/api/jobs`
Create a job listing.

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Backend Engineer",
    "description": "Build scalable REST APIs using Node.js, Express, and MongoDB",
    "requiredSkills": ["Node.js", "MongoDB", "Express"],
    "location": "Remote"
  }'
```

---

### GET `/api/match/:resumeId`
Get top-10 job matches for a resume.

```bash
curl http://localhost:3000/api/match/65f3a...
```

**Response:**
```json
{
  "success": true,
  "resumeId": "65f3a...",
  "totalMatches": 3,
  "data": [
    { "jobTitle": "Backend Engineer", "similarityScore": 0.8812, "location": "Remote" },
    { "jobTitle": "Node.js Developer", "similarityScore": 0.7640, "location": "NYC" }
  ]
}
```

---

### GET `/api/jobs`
List all jobs.

### GET `/health`
Health check.

---

## Running Locally (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running on `localhost:27017`

```bash
# 1. Clone / enter project
cd ai-resume-matcher

# 2. Install dependencies
npm install

# 3. Create .env
cp .env.example .env

# 4. Start dev server
npm run dev
```

---

## Running with Docker Compose

```bash
# Build and start backend + MongoDB
docker compose up --build

# Stop
docker compose down

# Stop and remove volumes (wipe DB)
docker compose down -v
```

The backend will be available at `http://localhost:3000`.

---

## Running Tests

Tests use `mongodb-memory-server` — **no live MongoDB needed**.

```bash
npm test
```

Test coverage:
- `resume.test.js` — file upload validation
- `job.test.js` — job creation and listing
- `match.test.js` — similarity ranking, sorted scores, 404/400 edge cases

---

## Project Structure

```
ai-resume-matcher/
├── server.js                   # Express app entry point
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── Resume.js
│   │   └── Job.js
│   ├── services/
│   │   ├── resumeParser.js     # PDF + DOCX text extraction
│   │   ├── embeddingService.js # TF-IDF vectorization
│   │   └── matchingService.js  # Cosine similarity ranking
│   ├── controllers/
│   │   ├── resumeController.js
│   │   ├── jobController.js
│   │   └── matchController.js
│   ├── routes/
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   └── matchRoutes.js
│   ├── middlewares/
│   │   ├── upload.js           # Multer config
│   │   └── errorHandler.js     # Global error handler
│   └── utils/
│       └── similarity.js       # Cosine similarity function
└── tests/
    ├── setup.js
    ├── teardown.js
    ├── resume.test.js
    ├── job.test.js
    └── match.test.js
```
