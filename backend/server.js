const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const resumeRoutes = require('./src/routes/resumeRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const suggestionRoutes = require('./src/routes/suggestionRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/suggestions', suggestionRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    const key = process.env.GEMINI_API_KEY || '';
    console.log(`[Server] Gemini Key Loaded: ${key ? key.substring(0, 7) + '...' : 'MISSING'}`);
  });
};

// Only start server when this file is run directly (not imported by tests)
if (require.main === module) {
  startServer().catch((err) => {
    console.error('[Server] Fatal error:', err.message);
    process.exit(1);
  });
}

module.exports = app;
