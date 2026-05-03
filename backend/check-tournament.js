const mongoose = require('mongoose');
const Team = require('./models/Team');
const Tournament = require('./models/Tournament');
const Bracket = require('./models/Bracket');
const dotenv = require('dotenv');

dotenv.config();

const tournamentId = '69f78c5697f9cd76e3b81d89';

const checkTournament = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n--- TOURNAMENT AUDIT REPORT ---\n');

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      console.error('Tournament not found');
      process.exit(1);
    }

    console.log(`Tournament: ${tournament.title}`);
    console.log(`Status: ${tournament.status}`);
    console.log(`Filled Slots (Counter): ${tournament.filledSlots}\n`);

    // 1. Teams Stats
    const totalTeams = await Team.countDocuments({ tournamentId });
    const approvedTeams = await Team.countDocuments({ tournamentId, status: 'APPROVED' });
    const pendingTeams = await Team.countDocuments({ tournamentId, status: 'WAITING_VERIFICATION' });

    console.log(`TOTAL TEAMS: ${totalTeams}`);
    console.log(`APPROVED: ${approvedTeams}`);
    console.log(`PENDING: ${pendingTeams}\n`);

    // 2. Batch Stats
    const brackets = await Bracket.find({ tournamentId });
    console.log(`TOTAL BATCHES CREATED: ${brackets.length}`);
    brackets.forEach(b => {
      console.log(` - ${b.batchSN} (Size: ${b.size}, Status: ${b.status})`);
    });
    console.log('');

    // 3. Team Assignment Details
    const teamsInBatches = await Team.find({ 
      tournamentId, 
      status: 'APPROVED',
      batchSN: { $ne: null, $ne: "" } 
    }).select('teamName batchSN approvalIndex');

    const teamsOnHold = await Team.find({ 
      tournamentId, 
      status: 'APPROVED',
      $or: [{ batchSN: null }, { batchSN: "" }]
    }).select('teamName createdAt').sort('createdAt');

    console.log(`TEAMS ASSIGNED TO BATCHES: ${teamsInBatches.length}`);
    teamsInBatches.forEach(t => {
      console.log(` - [${t.batchSN}] ${t.teamName}`);
    });

    console.log(`\nTEAMS ON HOLD (Waiting for Batch): ${teamsOnHold.length}`);
    for (let i = 0; i < teamsOnHold.length; i++) {
      const t = teamsOnHold[i];
      // Calculate approval index on the fly for audit
      const pos = await Team.countDocuments({
        tournamentId,
        status: 'APPROVED',
        $or: [
          { createdAt: { $lt: t.createdAt } },
          { createdAt: t.createdAt, _id: { $lt: t._id } }
        ]
      });
      console.log(` - [#${pos + 1}] ${t.teamName}`);
    }

    console.log('\n-------------------------------\n');
    process.exit(0);
  } catch (error) {
    console.error('Error running audit:', error);
    process.exit(1);
  }
};

checkTournament();
