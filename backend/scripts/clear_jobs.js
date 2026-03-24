const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const Job = require('../src/models/Job');

async function clearJobs() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_resume_matcher';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to database.');

        const result = await Job.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} jobs.`);
    } catch (err) {
        console.error('Error clearing jobs:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

clearJobs();
