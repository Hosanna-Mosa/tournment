const express = require('express');
const router = express.Router();
const {
  getTournamentTeams,
  updateTeamStatus,
  getMyTeam,
  updateMyTeam,
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:tournamentId', protect, admin, getTournamentTeams);
router.get('/my-team/:tournamentId', protect, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const Match = require('../models/Match');
    
    const team = await Team.findOne({ captain: req.user._id, tournamentId: req.params.tournamentId })
      .populate('bracketId');
    
    if (!team) return res.json(null);

    // Find current active match for this team
    const currentMatch = await Match.findOne({
      tournamentId: req.params.tournamentId,
      $or: [{ teamA: team._id }, { teamB: team._id }],
      status: { $in: ['ready', 'live'] }
    }).populate('teamA teamB');

    res.json({
      ...team.toObject(),
      currentMatch
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/my/:tournamentId', protect, updateMyTeam);
router.get('/detail/:teamId', protect, admin, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const team = await Team.findById(req.params.teamId).populate('captain', 'username email phone');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch('/:teamId/status', protect, admin, updateTeamStatus);

module.exports = router;
