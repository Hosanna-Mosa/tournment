const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    game: {
      type: String,
      default: 'Free Fire',
    },
    type: {
      type: String,
      required: true,
      enum: ['SOLO', 'DUO', '4V4 SQUAD'],
    },
    prizePool: {
      type: Number,
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    filledSlots: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['UPCOMING', 'LIVE', 'COMPLETED'],
      default: 'UPCOMING',
    },
    runnerUpPrize: {
      type: Number,
      default: 0,
    },
    rules: {
      type: [String],
    },
    schedule: {
      type: Date,
    },
    winnerTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    runnerUpTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    winnerUpiId: {
      type: String,
    },
    winnerPayoutStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING',
    },
    winnerPayoutRef: {
      type: String,
    },
    runnerUpUpiId: {
      type: String,
    },
    runnerUpPayoutStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING',
    },
    runnerUpPayoutRef: {
      type: String,
    },
    winnerName: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
