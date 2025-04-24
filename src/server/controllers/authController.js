
const User = require('../models/User');
const UserInvite = require('../models/UserInvite');
const { generateToken } = require('../utils/jwt');
const crypto = require('crypto');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: 'test_engineer' // Default role for self-registration
    });

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept invitation
exports.acceptInvite = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find invitation by token
    const invitation = await UserInvite.findOne({ 
      token, 
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return res.status(400).json({ message: 'Invalid or expired invitation' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: invitation.email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user from invitation
    const user = await User.create({
      name: invitation.email.split('@')[0], // Temporary name
      email: invitation.email,
      password,
      role: invitation.role
    });

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    // Generate JWT token
    const authToken = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: authToken
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
