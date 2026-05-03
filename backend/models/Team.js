const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    players: [
      {
        username: String,
        gameId: String,
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'WAITING_VERIFICATION'],
      default: 'WAITING_VERIFICATION',
    },
    utrNumber: {
      type: String,
    },
    isBracketted: {
      type: Boolean,
      default: false,
    },
    bracketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bracket',
    },
    batchSN: {
      type: String,
    },
    isBye: {
      type: Boolean,
      default: false,
    },
    isEliminated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
