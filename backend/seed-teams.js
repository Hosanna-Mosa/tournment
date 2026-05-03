const mongoose = require('mongoose');
const Team = require('./models/Team');
const Tournament = require('./models/Tournament');
const User = require('./models/User');
const { generateAutoBracket } = require('./utils/bracketGenerator');
const dotenv = require('dotenv');

dotenv.config();

const tournamentId = '69f701797eefc25b86a34ee7';

const seedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      console.error('Tournament not found');
      process.exit(1);
    }

    // Find an admin or any user to be the captain for all teams (for testing)
    let captain = await User.findOne({ email: 'admin@mhgaming.com' });
    if (!captain) {
      captain = await User.findOne({});
    }

    if (!captain) {
      console.error('No user found to be captain. Please register at least one user.');
      process.exit(1);
    }

    console.log(`Seeding 16 more teams for tournament: ${tournament.title}`);

    const createdTeams = [];
    for (let i = 1; i <= 32; i++) {
      const team = new Team({
        tournamentId: tournament._id,
        teamName: `Pro Team ${i}`,
        captain: captain._id,
        players: [
          { username: `Player ${i}-1`, gameId: `ID-${i}1` },
          { username: `Player ${i}-2`, gameId: `ID-${i}2` },
          { username: `Player ${i}-3`, gameId: `ID-${i}3` },
          { username: `Player ${i}-4`, gameId: `ID-${i}4` }
        ],
        status: 'APPROVED',
        isBracketted: false
      });

      await team.save();
      createdTeams.push(team);
      console.log(`Created Team ${i}`);
    }

    console.log(`Successfully seeded 16 more teams! Total should be 48.`);
    
    // Update filled slots
    tournament.filledSlots = 48;
    await tournament.save();

    console.log('Ready to generate the 48-team bracket in the Admin Panel!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedTeams();
