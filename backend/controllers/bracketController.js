const Bracket = require('../models/Bracket');
const Match = require('../models/Match');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const shuffleTeams = require('../utils/shuffleTeams');

// @desc    Generate bracket for a tournament
// @route   POST /api/bracket/generate/:tournamentId
// @access  Private/Admin
const generateBracket = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { generateAutoBracket } = require('../utils/bracketGenerator');

    // 1. Validate tournament
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // 2. Fetch ALL approved but UNBRACKETTED teams
    const availableTeams = await Team.find({ 
      tournamentId, 
      status: 'APPROVED', 
      isBracketted: { $ne: true } 
    });

    const teamCount = availableTeams.length;

    if (teamCount < 2) {
      return res.status(400).json({ 
        message: `Need at least 2 approved teams to generate a bracket. Currently have ${teamCount}.` 
      });
    }

    // 3. Use utility to generate ONE single unified bracket
    const result = await generateAutoBracket(tournamentId, availableTeams);

    res.status(201).json({
      message: `Successfully generated a single unified bracket for all ${teamCount} approved teams.`,
      bracket: result.bracket,
      matches: result.matches
    });

  } catch (error) {
    console.error("Bracket generation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get full bracket for a tournament
// @route   GET /api/bracket/:tournamentId
// @access  Public
const getFullBracket = async (req, res) => {
  try {
    const brackets = await Bracket.find({ tournamentId: req.params.tournamentId })
      .populate('winner', 'teamName')
      .populate('runnerUp', 'teamName');
    
    if (!brackets || brackets.length === 0) {
      return res.status(404).json({ message: 'No brackets found for this tournament' });
    }

    const fullBracketsData = await Promise.all(brackets.map(async (bracket) => {
      const matches = await Match.find({ bracketId: bracket._id })
        .populate({
          path: 'teamA',
          select: 'teamName captain',
          populate: { path: 'captain', select: 'username phone' }
        })
        .populate({
          path: 'teamB',
          select: 'teamName captain',
          populate: { path: 'captain', select: 'username phone' }
        })
        .populate('winner', 'teamName')
        .populate('loser', 'teamName')
        .sort({ round: 1, matchNumber: 1 });
      
      return { bracket, matches };
    }));

    res.json(fullBracketsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Declare winner for a match
// @route   PATCH /api/bracket/match/:matchId/winner
// @access  Private/Admin
const declareWinner = async (req, res) => {
  try {
    const { winnerId } = req.body;
    const matchId = req.params.matchId;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.status === 'completed') return res.status(400).json({ message: 'Match already completed' });

    // Validate winner is teamA or teamB
    if (match.teamA.toString() !== winnerId && match.teamB.toString() !== winnerId) {
      return res.status(400).json({ message: 'Winner must be one of the competing teams' });
    }

    const loserId = match.teamA.toString() === winnerId ? match.teamB : match.teamA;

    match.winner = winnerId;
    match.loser = loserId;
    match.status = 'completed';
    match.completedAt = Date.now();
    await match.save();

    // Mark the loser as eliminated
    await Team.findByIdAndUpdate(loserId, { isEliminated: true });

    const bracket = await Bracket.findById(match.bracketId);

    // Check if ALL matches in this round are completed
    const roundMatches = await Match.find({ bracketId: bracket._id, round: match.round });
    const allCompleted = roundMatches.every(m => m.status === 'completed');

    if (allCompleted) {
      let winners = roundMatches.map(m => m.winner);

      // Include Bye teams from the current round
      const byeTeams = await Team.find({ 
        bracketId: bracket._id, 
        isBye: true 
      });
      if (byeTeams.length > 0) {
        winners = [...winners, ...byeTeams.map(t => t._id)];
        // Clear isBye flag for these teams as they've now "advanced" to the next round pool
        await Team.updateMany(
          { _id: { $in: byeTeams.map(t => t._id) } },
          { isBye: false }
        );
      }

      // Check if this was the Final
      if (match.round === bracket.totalRounds) {
        bracket.status = 'completed';
        bracket.winner = winnerId;
        bracket.runnerUp = loserId;
        await bracket.save();

        // Also update the Tournament
        const winnerTeam = await Team.findById(winnerId);
        await Tournament.findByIdAndUpdate(match.tournamentId, {
          status: 'COMPLETED',
          winnerTeam: winnerId,
          runnerUpTeam: loserId,
          winnerName: winnerTeam.teamName
        });
      } else {
        // Generate next round matches and potentially a next round Bye
        const nextRound = match.round + 1;
        const shuffledWinners = shuffleTeams(winners);
        const nextNumMatches = Math.floor(shuffledWinners.length / 2);
        const nextNumByes = shuffledWinners.length % 2;
        
        // Create Matches
        for (let i = 0; i < nextNumMatches; i++) {
          const nextMatch = new Match({
            tournamentId: match.tournamentId,
            bracketId: bracket._id,
            round: nextRound,
            matchNumber: i + 1,
            teamA: shuffledWinners[i * 2],
            teamB: shuffledWinners[i * 2 + 1],
            status: 'ready',
            isFinal: nextRound === bracket.totalRounds
          });
          await nextMatch.save();
        }

        // Handle next round Bye
        if (nextNumByes > 0) {
          const byeTeamId = shuffledWinners[shuffledWinners.length - 1];
          await Team.findByIdAndUpdate(byeTeamId, { isBye: true });
        }

        bracket.currentRound = nextRound;
        await bracket.save();
      }
    }

    res.json({ message: 'Winner declared', match });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update room details for a match
// @route   PATCH /api/bracket/match/:matchId/room
// @access  Private/Admin
const updateRoomDetails = async (req, res) => {
  try {
    const { roomId, roomPassword, isRoomReleased } = req.body;
    const matchId = req.params.matchId;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (roomId !== undefined) match.roomId = roomId;
    if (roomPassword !== undefined) match.roomPassword = roomPassword;
    if (isRoomReleased !== undefined) match.isRoomReleased = isRoomReleased;

    const updatedMatch = await match.save();
    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateBracket,
  getFullBracket,
  declareWinner,
  updateRoomDetails
};
