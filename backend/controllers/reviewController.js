const Restaurant = require("../models/Restaurant");

// ─── Reviews controller ─────────────────────────────────────────────────
exports.getReviews = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).select("reviews rating");
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });
    res.json({ success: true, count: restaurant.reviews.length, data: restaurant.reviews, rating: restaurant.rating });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(400).json({ success: false, error: "Invalid ID or Server Error" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { rating, comment } = req.body;
    if (rating === undefined) return res.status(400).json({ success: false, error: "Rating is required" });
    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      return res.status(400).json({ success: false, error: "Rating must be a number between 0 and 5" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });

    const reviewerName = (req.user && (req.user.name || req.user.email)) || "Anonymous";
    const reviewerId = req.user && req.user._id ? req.user._id : null;

    // Optional: prevent duplicate reviews by the same user
    if (reviewerId) {
      const existing = restaurant.reviews.find((r) => r.userId && r.userId.toString() === reviewerId.toString());
      if (existing) {
        return res.status(400).json({ success: false, error: "You have already reviewed this shop" });
      }
    }

    const review = {
      user: reviewerName,
      comment: comment || "",
      rating: numericRating,
      userId: reviewerId,
    };

    restaurant.reviews.push(review);

    // Recalculate aggregate rating
    const sum = restaurant.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    restaurant.rating = restaurant.reviews.length ? Number((sum / restaurant.reviews.length).toFixed(2)) : 0;

    await restaurant.save();
    const addedReview = restaurant.reviews[restaurant.reviews.length - 1];
    res.status(201).json({ success: true, data: addedReview, rating: restaurant.rating });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { rating, comment } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });

    const review = restaurant.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });

    // Ownership check: allow if owner, or roles admin/shopkeeper
    const requesterId = req.user && req.user._id;
    const isOwner = review.userId && requesterId && review.userId.toString() === requesterId.toString();
    const isAdminOrShop = req.user && (req.user.role === "admin" || req.user.role === "shopkeeper");

    if (!isOwner && !isAdminOrShop) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this review" });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (Number.isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
        return res.status(400).json({ success: false, error: "Rating must be a number between 0 and 5" });
      }
      review.rating = numericRating;
    }
    if (comment !== undefined) review.comment = comment;

    await restaurant.save();

    // Recalculate rating
    const sum = restaurant.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    restaurant.rating = restaurant.reviews.length ? Number((sum / restaurant.reviews.length).toFixed(2)) : 0;
    await restaurant.save();

    res.json({ success: true, data: review, rating: restaurant.rating });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });

    const review = restaurant.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });

    const requesterId = req.user && req.user._id;
    const isOwner = review.userId && requesterId && review.userId.toString() === requesterId.toString();
    const isAdminOrShop = req.user && (req.user.role === "admin" || req.user.role === "shopkeeper");

    if (!isOwner && !isAdminOrShop) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this review" });
    }

    review.remove();

    // Recalculate rating
    const sum = restaurant.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    restaurant.rating = restaurant.reviews.length ? Number((sum / restaurant.reviews.length).toFixed(2)) : 0;

    await restaurant.save();
    res.json({ success: true, message: "Review deleted", rating: restaurant.rating });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};
