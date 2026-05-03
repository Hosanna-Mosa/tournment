const express = require('express');
const router = express.Router();
const {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
  updatePayoutInfo,
  updatePayoutStatus,
} = require('../controllers/tournamentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getTournaments).post(protect, admin, createTournament);
router
  .route('/:id')
  .get(getTournamentById)
  .put(protect, admin, updateTournament)
  .delete(protect, admin, deleteTournament);
router.route('/:id/register').post(protect, registerForTournament);
router.route('/:id/payout-info').put(protect, updatePayoutInfo);
router.route('/:id/payout-status').patch(protect, admin, updatePayoutStatus);

module.exports = router;
