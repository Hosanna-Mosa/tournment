const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isPublic: true }).sort('-date');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
exports.getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort('-date');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private/Admin
exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
