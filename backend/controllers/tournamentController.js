const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const Match = require('../models/Match');
const Bracket = require('../models/Bracket');
const shuffleTeams = require('../utils/shuffleTeams');

// @desc    Fetch all tournaments
// @route   GET /api/tournaments
// @access  Public
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({});
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single tournament
// @route   GET /api/tournaments/:id
// @access  Public
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a tournament
// @route   POST /api/tournaments
// @access  Private/Admin
const createTournament = async (req, res) => {
  try {
    const {
      title,
      type,
      prizePool,
      runnerUpPrize,
      entryFee,
      rules,
      schedule,
      startDate,
      startTime
    } = req.body;

    const tournament = new Tournament({
      title,
      type: type ? type.toUpperCase() : type,
      prizePool,
      runnerUpPrize: runnerUpPrize || 0,
      entryFee,
      rules,
      schedule,
      startDate,
      startTime
    });

    const createdTournament = await tournament.save();
    res.status(201).json(createdTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a tournament
// @route   PUT /api/tournaments/:id
// @access  Private/Admin
const updateTournament = async (req, res) => {
  try {
    const {
      title,
      type,
      prizePool,
      runnerUpPrize,
      entryFee,
      filledSlots,
      status,
      rules,
      schedule,
      startDate,
      startTime,
      winnerName
    } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (tournament) {
      tournament.title = title || tournament.title;
      tournament.type = type ? type.toUpperCase() : tournament.type;
      tournament.prizePool = prizePool || tournament.prizePool;
      tournament.runnerUpPrize = runnerUpPrize !== undefined ? runnerUpPrize : tournament.runnerUpPrize;
      tournament.entryFee = entryFee || tournament.entryFee;
      tournament.filledSlots = filledSlots || tournament.filledSlots;
      
      // If status is changing to ongoing, auto-generate the bracket
      if (status === 'ongoing' && tournament.status !== 'ongoing') {
        const { generateAutoBracket } = require('../utils/bracketGenerator');
        
        // Find all approved but unbracketted teams
        const approvedTeams = await Team.find({ 
          tournamentId: tournament._id, 
          status: 'APPROVED', 
          isBracketted: { $ne: true } 
        });

        if (approvedTeams.length >= 2) {
          try {
            await generateAutoBracket(tournament._id, approvedTeams);
            console.log(`[AUTO-BRACKET] Successfully generated bracket for tournament ${tournament._id}`);
          } catch (bracketErr) {
            console.error(`[AUTO-BRACKET] Failed to generate bracket: ${bracketErr.message}`);
          }
        }
      }

      tournament.status = status || tournament.status;
      tournament.rules = rules || tournament.rules;
      tournament.schedule = schedule || tournament.schedule;
      tournament.startDate = startDate || tournament.startDate;
      tournament.startTime = startTime || tournament.startTime;
      tournament.winnerName = winnerName || tournament.winnerName;

      const updatedTournament = await tournament.save();
      res.json(updatedTournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a tournament
// @route   DELETE /api/tournaments/:id
// @access  Private/Admin
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (tournament) {
      await tournament.deleteOne();
      res.json({ message: 'Tournament removed' });
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for a tournament
// @route   POST /api/tournaments/:id/register
// @access  Private
const registerForTournament = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const tournament = await Tournament.findById(req.params.id);

    if (tournament) {
      // 1. Check if user already has a team in this tournament
      const alreadyRegistered = await Team.findOne({
        captain: req.user._id,
        tournamentId: req.params.id,
      });

      if (alreadyRegistered) {
        return res.status(400).json({ message: 'You have already registered a team for this tournament' });
      }

      // 2. Create the Team in WAITING_VERIFICATION status
      const team = new Team({
        captain: req.user._id,
        tournamentId: req.params.id,
        teamName: req.body.teamName,
        players: req.body.players || [],
        utrNumber: req.body.utrNumber,
        status: 'WAITING_VERIFICATION'
      });

      // 2. Validation: UTR format (12 digits)
      const utrRegex = /^\d{12}$/;
      if (!team.utrNumber || !utrRegex.test(team.utrNumber)) {
        return res.status(400).json({ message: 'Invalid UTR format. Must be exactly 12 digits.' });
      }

      // 3. Validation: UTR uniqueness
      const utrExists = await Team.findOne({ utrNumber: team.utrNumber });
      if (utrExists) {
        return res.status(400).json({ 
          message: 'This UTR number has already been used. If you think this is an error, please contact admin.' 
        });
      }

      await team.save();

      // 3. Increment slot count ONLY when approved (handled in teamController)
      // tournament.filledSlots += 1;
      // await tournament.save();

      res.status(201).json({ 
        message: 'Registration submitted! Please wait for admin to verify your payment and then wait for room ID password.',
        status: 'WAITING_VERIFICATION'
      });
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update payout info (UPI ID) for winner or runner-up
// @route   PUT /api/tournaments/:id/payout-info
// @access  Private
const updatePayoutInfo = async (req, res) => {
  try {
    const { upiId } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    if (tournament.status !== 'COMPLETED') return res.status(400).json({ message: 'Tournament is not completed yet' });

    // Find the user's team in this tournament
    const team = await Team.findOne({ captain: req.user._id, tournamentId: tournament._id });
    if (!team) return res.status(403).json({ message: 'You are not a captain in this tournament' });

    if (tournament.winnerTeam && tournament.winnerTeam.toString() === team._id.toString()) {
      tournament.winnerUpiId = upiId;
    } else if (tournament.runnerUpTeam && tournament.runnerUpTeam.toString() === team._id.toString()) {
      tournament.runnerUpUpiId = upiId;
    } else {
      return res.status(403).json({ message: 'Only winner or runner-up captains can submit payout info' });
    }

    await tournament.save();
    res.json({ message: 'Payout info updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update payout status and reference (Admin only)
// @route   PATCH /api/tournaments/:id/payout-status
// @access  Private/Admin
const updatePayoutStatus = async (req, res) => {
  try {
    const { type, status, ref } = req.body; // type: 'winner' or 'runnerUp'
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    if (type === 'winner') {
      if (status) tournament.winnerPayoutStatus = status;
      if (ref) tournament.winnerPayoutRef = ref;
    } else if (type === 'runnerUp') {
      if (status) tournament.runnerUpPayoutStatus = status;
      if (ref) tournament.runnerUpPayoutRef = ref;
    } else {
      return res.status(400).json({ message: 'Invalid payout type' });
    }

    await tournament.save();
    res.json({ message: 'Payout status updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
  updatePayoutInfo,
  updatePayoutStatus
};
