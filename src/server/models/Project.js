
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'On Hold', 'Completed'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for project statistics
projectSchema.virtual('progress').get(function() {
  return this._progress || 0;
});

projectSchema.virtual('testCaseCount').get(function() {
  return this._testCaseCount || 0;
});

projectSchema.virtual('passRate').get(function() {
  return this._passRate || 0;
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
