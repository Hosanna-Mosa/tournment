const Team = require('../models/Team');
const Tournament = require('../models/Tournament');

// @desc    Get all teams for a tournament
// @route   GET /api/teams/:tournamentId
// @access  Private/Admin
const getTournamentTeams = async (req, res) => {
  try {
    console.log(`[DEBUG] Fetching teams for tournament: ${req.params.tournamentId}`);
    const teams = await Team.find({ tournamentId: req.params.tournamentId })
      .populate('captain', 'username email');
    console.log(`[DEBUG] Found ${teams.length} teams`);
    res.json(teams);
  } catch (error) {
    console.error(`[DEBUG] Error fetching teams: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team status (Approve/Reject)
// @route   PATCH /api/teams/:teamId/status
// @access  Private/Admin
const updateTeamStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (team) {
      team.status = status;
      if (adminNote !== undefined) team.adminNote = adminNote;
      const updatedTeam = await team.save();
      res.json(updatedTeam);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user's team for a tournament
// @route   GET /api/teams/my/:tournamentId
// @access  Private
const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ 
      tournamentId: req.params.tournamentId,
      captain: req.user._id 
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update my team details
// @route   PUT /api/teams/my/:tournamentId
// @access  Private
const updateMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ 
      tournamentId: req.params.tournamentId,
      captain: req.user._id 
    });

    if (team) {
      team.teamName = req.body.teamName || team.teamName;
      team.players = req.body.players || team.players;
      
      const updatedTeam = await team.save();
      res.json(updatedTeam);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTournamentTeams,
  updateTeamStatus,
  getMyTeam,
  updateMyTeam,
};
