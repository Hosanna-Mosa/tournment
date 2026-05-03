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
    },
    rules: {
      type: [String],
      default: [
        "Level 40+ IDs required.",
        "Emulators strictly prohibited.",
        "Standard map rotation apply.",
        "POV recording mandatory for all matches.",
        "No hacking or use of third-party tools.",
        "All team members must be present 15 mins before match.",
        "Internet issues are at the player's own risk.",
        "Organizers decision is final and binding.",
        "Teaming with other teams results in immediate disqualification.",
        "Proper screenshots must be provided after match completion.",
        "No abusive language in the lobby or match.",
        "Respect all fellow competitors.",
        "Prize pool will be distributed within 48 hours.",
        "Matches will be played on Bermuda and Purgatory."
      ]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
