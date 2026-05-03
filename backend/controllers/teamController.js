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
      const oldStatus = team.status;
      team.status = status;
      if (adminNote !== undefined) team.adminNote = adminNote;
      const updatedTeam = await team.save();

      // Update tournament filled slots only if status changes to/from APPROVED
      if (status === 'APPROVED' && oldStatus !== 'APPROVED') {
        await Tournament.findByIdAndUpdate(team.tournamentId, { $inc: { filledSlots: 1 } });
      } else if (oldStatus === 'APPROVED' && status !== 'APPROVED') {
        await Tournament.findByIdAndUpdate(team.tournamentId, { $inc: { filledSlots: -1 } });
      }

      // AUTOMATIC BATCHING LOGIC
      // Whenever any team's approval status changes, we re-calculate all batches for this tournament
      const allApproved = await Team.find({ 
        tournamentId: team.tournamentId, 
        status: 'APPROVED' 
      }).sort({ createdAt: 1, _id: 1 });

      // Reset all batchSNs for this tournament to ensure clean re-calculation
      await Team.updateMany(
        { tournamentId: team.tournamentId }, 
        { $unset: { batchSN: "" } }
      );

      const numFullBatches = Math.floor(allApproved.length / 8);
      for (let i = 0; i < numFullBatches; i++) {
        const batchSN = `SN-${String(i + 1).padStart(2, '0')}`;
        const batchTeamIds = allApproved.slice(i * 8, (i + 1) * 8).map(t => t._id);
        await Team.updateMany(
          { _id: { $in: batchTeamIds } }, 
          { $set: { batchSN: batchSN } }
        );
      }

      // Fetch the most updated version of the team to return
      const finalUpdatedTeam = await Team.findById(team._id);
      res.json(finalUpdatedTeam);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ 
      tournamentId: req.params.tournamentId,
      captain: req.user._id 
    }).lean();

    if (team && team.status === 'APPROVED') {
      // Calculate position among approved teams using stable sorting (createdAt + _id)
      const position = await Team.countDocuments({
        tournamentId: req.params.tournamentId,
        status: 'APPROVED',
        $or: [
          { createdAt: { $lt: team.createdAt } },
          { createdAt: team.createdAt, _id: { $lt: team._id } }
        ]
      });
      team.approvalIndex = position + 1; // 1-based index

      if (!team.batchSN) {
        // Calculate teams needed to fill the next batch of 8
        const remainder = team.approvalIndex % 8;
        team.teamsNeededForBatch = remainder === 0 ? 0 : 8 - remainder;
      }
    }

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

// @desc    Update team refund UPI ID
// @route   PATCH /api/teams/my/refund-upi/:tournamentId
// @access  Private
const updateRefundUPI = async (req, res) => {
  try {
    const { refundUPI } = req.body;
    const team = await Team.findOne({ 
      tournamentId: req.params.tournamentId,
      captain: req.user._id 
    });

    if (team) {
      team.refundUPI = refundUPI;
      team.refundStatus = 'submitted';
      await team.save();
      res.json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update team refund UTR (Admin)
// @route   PATCH /api/teams/:teamId/refund-utr
// @access  Private/Admin
const updateRefundUTR = async (req, res) => {
  try {
    const { refundUTR } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (team) {
      team.refundUTR = refundUTR;
      team.refundStatus = 'completed';
      await team.save();
      res.json(team);
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
  updateRefundUPI,
  updateRefundUTR,
};
