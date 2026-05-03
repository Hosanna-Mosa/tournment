const express = require('express');
const { 
  getReviews, 
  getAdminReviews, 
  createReview, 
  updateReview, 
  deleteReview 
} = require('../controllers/reviewController');

const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getReviews)
  .post(protect, admin, createReview);

router.route('/admin')
  .get(protect, admin, getAdminReviews);

router.route('/:id')
  .put(protect, admin, updateReview)
  .delete(protect, admin, deleteReview);

module.exports = router;
