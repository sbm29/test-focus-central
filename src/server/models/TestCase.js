
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  type: {
    type: String,
    enum: ['Functional', 'Integration', 'UI/UX', 'Performance', 'Security'],
    default: 'Functional'
  },
  preconditions: {
    type: String,
    trim: true
  },
  steps: {
    type: String,
    required: true,
    trim: true
  },
  expectedResults: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Ready', 'In Progress', 'Passed', 'Failed'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;
