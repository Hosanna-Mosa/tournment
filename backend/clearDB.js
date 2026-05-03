const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const Team = require('./models/Team');
const Review = require('./models/Review');
const Bracket = require('./models/Bracket');
const Match = require('./models/Match');
const Settings = require('./models/Settings');

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for cleanup...');

    // Delete all tournaments
    await Tournament.deleteMany({});
    console.log('✓ Tournaments cleared');

    // Delete all teams
    await Team.deleteMany({});
    console.log('✓ Teams cleared');

    // Delete all brackets
    await Bracket.deleteMany({});
    console.log('✓ Brackets cleared');

    // Delete all matches
    await Match.deleteMany({});
    console.log('✓ Matches cleared');

    // Delete all reviews
    await Review.deleteMany({});
    console.log('✓ Reviews cleared');

    // Delete all settings (optional, but requested "whole database")
    // If you want to keep settings, comment out the line below
    await Settings.deleteMany({});
    console.log('✓ Settings cleared');

    // Delete all users EXCEPT those with role 'admin'
    const adminCount = await User.countDocuments({ role: 'admin' });
    const deleteResult = await User.deleteMany({ role: { $ne: 'admin' } });
    
    console.log(`✓ Users cleared (Deleted: ${deleteResult.deletedCount}, Preserved Admins: ${adminCount})`);

    console.log('\nDatabase cleanup completed successfully.');
    process.exit();
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
