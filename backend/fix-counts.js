const mongoose = require('mongoose');
const Team = require('./models/Team');
const Tournament = require('./models/Tournament');
const dotenv = require('dotenv');

dotenv.config();

const fixCounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const tournaments = await Tournament.find({});
    console.log(`Found ${tournaments.length} tournaments to check.\n`);

    for (const t of tournaments) {
      const approvedCount = await Team.countDocuments({ 
        tournamentId: t._id, 
        status: 'APPROVED' 
      });

      console.log(`Tournament: ${t.title}`);
      console.log(`Current Count: ${t.filledSlots}`);
      console.log(`Actual Approved Teams: ${approvedCount}`);

      if (t.filledSlots !== approvedCount) {
        t.filledSlots = approvedCount;
        await t.save();
        console.log(`✅ FIXED count to ${approvedCount}`);
      } else {
        console.log(`✓ Count is correct.`);
      }
      console.log('---');
    }

    console.log('\nAll tournament counts synchronized with approved teams.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing counts:', error);
    process.exit(1);
  }
};

fixCounts();
