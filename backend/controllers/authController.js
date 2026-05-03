const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { identifier, password } = req.body;

  // Find user by email OR phone
  const user = await User.findOne({ 
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid identifier or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  const userExists = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });

  if (userExists) {
    res.status(400).json({ message: 'User with this email or phone already exists' });
    return;
  }

  const user = await User.create({
    username,
    email,
    phone,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      points: user.points,
      kills: user.kills,
      matchesPlayed: user.matchesPlayed,
      savedTeam: user.savedTeam,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.savedTeam) {
      user.savedTeam = req.body.savedTeam;
    }
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      savedTeam: updatedUser.savedTeam,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all moderators
// @route   GET /api/users/moderators
// @access  Private/Admin
const getModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: 'moderator' }).select('-password');
    res.json(moderators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile, getModerators };
