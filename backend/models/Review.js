const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    comment: { type: String, default: '' },
    rating: { type: Number, required: true, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = reviewSchema;
