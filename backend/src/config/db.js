const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_resume_matcher';
  let retries = 5;

  while (retries > 0) {
    try {
      await mongoose.connect(uri);
      console.log(`[DB] Connected to MongoDB: ${uri}`);
      return;
    } catch (err) {
      retries -= 1;
      console.error(`[DB] Connection failed. Retries left: ${retries}. Error: ${err.message}`);
      if (retries === 0) throw err;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

module.exports = connectDB;
