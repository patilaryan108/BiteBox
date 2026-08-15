const express = require("express");
const {
  getRestaurants,
  addRestaurant,
  getRestaurantById,
  deleteRestaurant,
  addMenuItemToRestaurant,
  deleteMenuItemFromRestaurant,
  addItemToRestaurant,
  deleteItemFromRestaurant,
  getAllRestaurants,
  toggleMenuItemFeatured,
  getFeaturedItems,
  setMenuItemAvailability,
} = require("../controllers/restaurantController");
const { verifyToken, requireRole } = require("../middleware/auth");
const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

// PUBLIC: Search
router.get("/", getRestaurants);

// PUBLIC: Get all (for admin)
router.get("/all", getAllRestaurants);

// ADMIN: Add restaurant
router.post("/", verifyToken, requireRole("admin"), addRestaurant);

// PUBLIC: Single restaurant
router.get("/:id", getRestaurantById);

// ADMIN: Delete restaurant
router.delete("/:id", verifyToken, requireRole("admin"), deleteRestaurant);

// ─── Rich menu item routes (shopkeeper/admin) ─────────────────────────────
// Add a rich menu item (with price, type, description)
router.post(
  "/:id/menu",
  verifyToken,
  requireRole("shopkeeper", "admin"),
  addMenuItemToRestaurant
);

// Delete a rich menu item by its Mongoose _id
router.delete(
  "/:id/menu/:itemId",
  verifyToken,
  requireRole("shopkeeper", "admin"),
  deleteMenuItemFromRestaurant
);

// Allow shopkeepers and admins to set an item's availability
router.patch(
  "/:id/menu/:itemId/availability",
  verifyToken,
  requireRole("shopkeeper", "admin"),
  setMenuItemAvailability
);

// ADMIN: Toggle featured flag on a menu item (shows/hides on homepage)
router.patch("/:id/menu/:itemId/featured", verifyToken, requireRole("admin"), toggleMenuItemFeatured);

// PUBLIC: Get all featured menu items (for homepage hero sections)
router.get("/featured/all", getFeaturedItems);

// ─── Legacy string item routes (admin quick-add) ──────────────────────────
router.post("/:id/items", verifyToken, requireRole("shopkeeper", "admin"), addItemToRestaurant);
router.delete("/:id/items/:itemName", verifyToken, requireRole("shopkeeper", "admin"), deleteItemFromRestaurant);

// Mount review router (handles /:id/reviews/...)
router.use('/:id/reviews', reviewRoutes);

module.exports = router;
