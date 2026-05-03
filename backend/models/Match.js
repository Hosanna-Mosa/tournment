const mongoose = require('mongoose');

const matchSchema = mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    bracketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bracket',
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    loser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    status: {
      type: String,
      enum: ['waiting', 'ready', 'live', 'completed'],
      default: 'waiting',
    },
    scheduledTime: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    isFinal: {
      type: Boolean,
      default: false,
    },
    roomId: {
      type: String,
    },
    roomPassword: {
      type: String,
    },
    isRoomReleased: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
