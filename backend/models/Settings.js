const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    upiId: {
      type: String,
      default: 'mhgaming@upi',
    },
    qrCodeUrl: {
      type: String,
      default: '', // Admin can upload or provide URL
    },
    whatsappNumber: {
      type: String,
      default: '9398334115',
    },
    liveStreamUrl: {
      type: String,
      default: '',
    },
    howToRegisterUrl: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
