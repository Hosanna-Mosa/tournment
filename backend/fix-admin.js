const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@mhgaming.com';
    const adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('User admin@mhgaming.com updated to role: admin');
    } else {
      console.log('User admin@mhgaming.com not found. Please register it first or check the database.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
