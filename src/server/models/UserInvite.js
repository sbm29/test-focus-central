
const mongoose = require('mongoose');
const crypto = require('crypto');

const userInviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'test_manager', 'test_engineer'],
    default: 'test_engineer'
  },
  token: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

const UserInvite = mongoose.model('UserInvite', userInviteSchema);

module.exports = UserInvite;
