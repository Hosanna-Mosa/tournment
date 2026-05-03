const Match = require('../models/Match');
const Bracket = require('../models/Bracket');
const Team = require('../models/Team');
const shuffleTeams = require('./shuffleTeams');

/**
 * Automatically generates a bracket for a batch of teams.
 * @param {string} tournamentId 
 * @param {Array} teams 
 */
const generateAutoBracket = async (tournamentId, teams, customTitle) => {
  const batchSize = teams.length;
  if (batchSize < 2) return null; // Need at least 2 teams for a match

  const numMatches = Math.floor(batchSize / 2);
  const numByes = batchSize % 2;
  const totalRounds = Math.ceil(Math.log2(batchSize));

  // 1. Determine Title
  const bracketCount = await Bracket.countDocuments({ tournamentId });
  const title = customTitle || `SN-${String(bracketCount + 1).padStart(2, '0')}`;

  // 2. Create Bracket
  const bracket = new Bracket({
    tournamentId,
    title,
    size: batchSize,
    totalRounds,
    status: 'ongoing',
    currentRound: 1,
    batchSN: title // Use title as batch identifier for the bracket record
  });
  const savedBracket = await bracket.save();

  // 3. Shuffle and Create Round 1 Matches
  const shuffled = shuffleTeams(teams);
  const matches = [];

  // Teams that get matches
  for (let i = 0; i < numMatches; i++) {
    const teamA = shuffled[i * 2];
    const teamB = shuffled[i * 2 + 1];

    const match = new Match({
      tournamentId,
      bracketId: savedBracket._id,
      round: 1,
      matchNumber: i + 1,
      teamA: teamA._id,
      teamB: teamB._id,
      status: 'ready',
      isFinal: totalRounds === 1
    });
    const savedMatch = await match.save();
    matches.push(savedMatch);

    await Team.findByIdAndUpdate(teamA._id, { isBracketted: true, bracketId: savedBracket._id });
    await Team.findByIdAndUpdate(teamB._id, { isBracketted: true, bracketId: savedBracket._id });
  }

  // Team that gets a BYE (if any)
  if (numByes > 0) {
    const team = shuffled[batchSize - 1];
    await Team.findByIdAndUpdate(team._id, { 
      isBracketted: true, 
      bracketId: savedBracket._id, 
      isBye: true 
    });
  }

  return { bracket: savedBracket, matches };
};

module.exports = { generateAutoBracket };
