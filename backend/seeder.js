const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const Team = require('./models/Team');
const Bracket = require('./models/Bracket');
const Match = require('./models/Match');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // 1. Clear existing data
    await User.deleteMany();
    await Tournament.deleteMany();
    await Team.deleteMany();
    await Bracket.deleteMany();
    await Match.deleteMany();

    console.log('Database Cleared...');

    // 2. Create Admin
    const admin = await User.create({
      username: 'admin_mh',
      email: 'admin@mhgaming.com',
      password: 'password123',
      role: 'admin',
    });

    // 3. Create 8 Captains/Users
    const captainData = [
      { username: 'Phantom', email: 'phantom@gmail.com', password: 'password123' },
      { username: 'Neon_Blade', email: 'neon@gmail.com', password: 'password123' },
      { username: 'Viper_X', email: 'viper@gmail.com', password: 'password123' },
      { username: 'Ghost_FF', email: 'ghost@gmail.com', password: 'password123' },
      { username: 'Delta_King', email: 'delta@gmail.com', password: 'password123' },
      { username: 'Shadow_Op', email: 'shadow@gmail.com', password: 'password123' },
      { username: 'Phoenix_YT', email: 'phoenix@gmail.com', password: 'password123' },
      { username: 'Mystic_Pro', email: 'mystic@gmail.com', password: 'password123' },
    ];

    const createdCaptains = await User.insertMany(captainData);

    // 4. Create Tournament
    const tournament = await Tournament.create({
      title: 'Free Fire Pro League S1',
      game: 'Free Fire',
      type: '4V4 SQUAD',
      prizePool: 50000,
      entryFee: 100,
      totalSlots: 8,
      filledSlots: 8,
      status: 'UPCOMING',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-HbwGKJxkCRiKXmcN3rxdH5ko6_xD_tvVrGxmFhkb8dIz4k66_wPY6vhDAXqYTXhrWbwmvFheQc3XfhedYs0yDjhudQlMzNFK1fHsZmVwIaeWVfEuY6e5R_JEmlHnj2YtgWMOV-aAojNbF26rDRcuzjVF-PqVhSOjFplBVcsHDtCJb9IR_2vj4MBUBnToIlq-Wf9YYMLxmhUtMAOBYW-_kjKhKOGmI3ZhZrWOpW9CFoh9GrwWK2pIwf4u_NwYawan0BGHxATtz68x',
      description: 'The ultimate Free Fire showdown. Only for pros.',
      rules: ['No emulators', 'Standard map', 'Level 50+'],
      schedule: new Date(Date.now() + 86400000),
    });

    // 5. Create 8 Approved Teams
    const teamNames = [
      'Apex Predators', 'Neon Samurai', 'Viper Esports', 'Ghost Walkers',
      'Team Delta', 'Shadow Strikers', 'Phoenix Force', 'Mystic Warriors'
    ];

    const teams = teamNames.map((name, index) => ({
      tournamentId: tournament._id,
      teamName: name,
      captain: createdCaptains[index]._id,
      status: 'APPROVED',
      players: [
        { username: `${name}_P1`, gameId: `FF-${1000 + index}1` },
        { username: `${name}_P2`, gameId: `FF-${1000 + index}2` },
        { username: `${name}_P3`, gameId: `FF-${1000 + index}3` },
        { username: `${name}_P4`, gameId: `FF-${1000 + index}4` },
      ]
    }));

    await Team.insertMany(teams);

    console.log('Data Seeded Successfully!');
    console.log(`Admin Login: admin@mhgaming.com / password123`);
    console.log(`Tournament ID: ${tournament._id}`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Tournament.deleteMany();
    await Team.deleteMany();
    await Bracket.deleteMany();
    await Match.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
