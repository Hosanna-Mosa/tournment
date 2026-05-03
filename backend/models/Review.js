const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
