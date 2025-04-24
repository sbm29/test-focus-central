
const mongoose = require('mongoose');

const testExecutionSchema = new mongoose.Schema({
  testCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  },
  status: {
    type: String,
    enum: ['Passed', 'Failed', 'Blocked', 'Not Executed'],
    default: 'Not Executed'
  },
  actualResults: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  executedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const TestExecution = mongoose.model('TestExecution', testExecutionSchema);

module.exports = TestExecution;
