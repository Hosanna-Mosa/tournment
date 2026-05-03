const express = require('express');
const router = express.Router();
const {
  generateBracket,
  getFullBracket,
  declareWinner
} = require('../controllers/bracketController');
const {
  updateMatchStatus,
  setRoomDetails,
  toggleRoomRelease,
  getMatchRoomId
} = require('../controllers/matchController');
const { protect, admin } = require('../middleware/authMiddleware');

// Bracket general routes
router.post('/generate/:tournamentId', protect, admin, generateBracket);
router.get('/:tournamentId', getFullBracket);

// Match specific routes
router.patch('/match/:matchId/winner', protect, admin, declareWinner);
router.patch('/match/:matchId/status', protect, admin, updateMatchStatus);
router.patch('/match/:matchId/roomid', protect, admin, setRoomDetails);
router.patch('/match/:matchId/release', protect, admin, toggleRoomRelease);
router.get('/match/:matchId/roomid', protect, getMatchRoomId);

module.exports = router;
