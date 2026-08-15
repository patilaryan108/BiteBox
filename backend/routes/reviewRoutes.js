const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// GET /api/restaurants/:id/reviews
router.get('/', getReviews);

// POST /api/restaurants/:id/reviews (customer)
router.post('/', verifyToken, requireRole('customer'), addReview);

// PATCH /api/restaurants/:id/reviews/:reviewId
router.patch('/:reviewId', verifyToken, updateReview);

// DELETE /api/restaurants/:id/reviews/:reviewId
router.delete('/:reviewId', verifyToken, deleteReview);

module.exports = router;
