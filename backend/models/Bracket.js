const mongoose = require('mongoose');

const bracketSchema = mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'completed'],
      default: 'pending',
    },
    currentRound: {
      type: Number,
      default: 1,
    },
    totalRounds: {
      type: Number,
    },
    batchSN: {
      type: String,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    runnerUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bracket', bracketSchema);
