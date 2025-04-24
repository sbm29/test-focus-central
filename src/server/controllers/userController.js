
const User = require('../models/User');
const UserInvite = require('../models/UserInvite');
const { sendInvitationEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'test_manager', 'test_engineer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Invite new user (admin only)
exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!['admin', 'test_manager', 'test_engineer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Check if invitation already exists
    let invitation = await UserInvite.findOne({ email, status: 'pending' });
    
    if (invitation) {
      // Update existing invitation
      invitation.role = role;
      invitation.token = crypto.randomBytes(32).toString('hex');
      invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    } else {
      // Create new invitation
      invitation = await UserInvite.create({
        email,
        role
      });
    }
    
    // Generate a temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');
    
    // Send invitation email
    await sendInvitationEmail(email, invitation.token, role, tempPassword);
    
    res.status(201).json({
      message: 'Invitation sent successfully',
      invite: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pending invitations (admin only)
exports.getPendingInvites = async (req, res) => {
  try {
    const invites = await UserInvite.find({ status: 'pending' });
    res.status(200).json(invites);
  } catch (error) {
    console.error('Get invites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend invitation (admin only)
exports.resendInvite = async (req, res) => {
  try {
    const invitation = await UserInvite.findById(req.params.id);
    
    if (!invitation || invitation.status !== 'pending') {
      return res.status(404).json({ message: 'Invitation not found or already accepted' });
    }
    
    // Generate a new token and reset expiration
    invitation.token = crypto.randomBytes(32).toString('hex');
    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await invitation.save();
    
    // Generate a temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');
    
    // Resend invitation email
    await sendInvitationEmail(invitation.email, invitation.token, invitation.role, tempPassword);
    
    res.status(200).json({ 
      message: 'Invitation resent successfully',
      invite: invitation
    });
  } catch (error) {
    console.error('Resend invite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
