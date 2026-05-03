const Match = require('../models/Match');

// @desc    Update match status
// @route   PATCH /api/bracket/match/:matchId/status
// @access  Private/Admin
const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.matchId);

    if (match) {
      match.status = status;
      await match.save();
      res.json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set room ID and password
// @route   PATCH /api/bracket/match/:matchId/roomid
// @access  Private/Admin
const setRoomDetails = async (req, res) => {
  try {
    const { roomId, roomPassword } = req.body;
    const match = await Match.findById(req.params.matchId);

    if (match) {
      match.roomId = roomId;
      match.roomPassword = roomPassword;
      await match.save();
      res.json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Room ID release
// @route   PATCH /api/bracket/match/:matchId/release
// @access  Private/Admin
const toggleRoomRelease = async (req, res) => {
  try {
    const { release } = req.body;
    const match = await Match.findById(req.params.matchId);

    if (match) {
      if (!match.roomId && release) {
        return res.status(400).json({ message: 'Cannot release empty Room ID' });
      }
      match.isRoomReleased = release;
      
      // Auto-update status if it's currently waiting or ready
      if (release && match.status === 'waiting') {
        match.status = 'ready';
      } else if (!release && match.status === 'ready') {
        match.status = 'waiting';
      }

      await match.save();
      res.json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get match room ID for player
// @route   GET /api/bracket/match/:matchId/roomid
// @access  Private
const getMatchRoomId = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate('teamA')
      .populate('teamB');

    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (!match.isRoomReleased) return res.status(403).json({ message: 'Room ID not yet released' });

    // Check if user is in teamA or teamB
    const isTeamA = match.teamA.captain.toString() === req.user._id.toString();
    const isTeamB = match.teamB.captain.toString() === req.user._id.toString();

    if (isTeamA || isTeamB) {
      res.json({
        roomId: match.roomId,
        roomPassword: match.roomPassword
      });
    } else {
      res.status(403).json({ message: 'You are not a player in this match' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateMatchStatus,
  setRoomDetails,
  toggleRoomRelease,
  getMatchRoomId
};
