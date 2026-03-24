const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    embedding: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
