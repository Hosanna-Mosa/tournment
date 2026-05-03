const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getModerators,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/moderators', protect, admin, getModerators);

module.exports = router;
