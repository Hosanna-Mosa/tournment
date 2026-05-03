const User = require('../models/User');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const players = await User.find({})
      .select('username points kills matchesPlayed')
      .sort({ points: -1 })
      .limit(100);
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
