const Restaurant = require("../models/Restaurant");

// ─── Search with geo ranking ───────────────────────────────────────────────
exports.getRestaurants = async (req, res) => {
  try {
    const { lat, lng, food, maxPrice, type, mealType, isOpen } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required query parameters" });
    }

    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    const mPrice = maxPrice ? parseFloat(maxPrice) : 5000;

    const matchQuery = {};

    if (food) {
      matchQuery.$or = [
        { name: { $regex: food, $options: "i" } },
        { items: { $regex: food, $options: "i" } },           // legacy string items
        { "menu.name": { $regex: food, $options: "i" } },     // rich menu items
      ];
    }
    if (type) matchQuery.type = type;
    if (mealType) matchQuery.mealType = mealType;
    if (isOpen !== undefined) matchQuery.isOpen = isOpen === "true";
    if (maxPrice) matchQuery.priceRange = { $lte: mPrice };

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          query: matchQuery,
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$rating", 2] },
              { $divide: [{ $subtract: [mPrice, "$priceRange"] }, 50] },
              { $divide: [1000, { $add: ["$distance", 1] }] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
    ]);

    res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// ─── Get ALL (no geo — for admin) ─────────────────────────────────────────
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// ─── Add restaurant (admin only) ──────────────────────────────────────────
exports.addRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Get single restaurant ────────────────────────────────────────────────
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(400).json({ success: false, error: "Invalid ID or Server Error" });
  }
};

// ─── Delete restaurant (admin only) ──────────────────────────────────────
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }
    res.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(400).json({ success: false, error: "Invalid ID or Server Error" });
  }
};

// ─── Add rich menu item (shopkeeper/admin) ────────────────────────────────
exports.addMenuItemToRestaurant = async (req, res) => {
  try {
    const { name, price, type, description, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: "Item name and price are required" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          menu: {
            name,
            price: Number(price),
            type: type || "other",
            description: description || "",
            image: image || "",
          },
        },
        $addToSet: { items: name },
      },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Delete menu item by _id (shopkeeper/admin) ───────────────────────────
exports.deleteMenuItemFromRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $pull: { menu: { _id: req.params.itemId } } },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Legacy string item add (admin quick-add) ─────────────────────────────
exports.addItemToRestaurant = async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ success: false, error: "Item name is required" });

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { items: item } },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Legacy string item delete ────────────────────────────────────────────
exports.deleteItemFromRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $pull: { items: req.params.itemName } },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Toggle featured flag on a menu item (admin only) ─────────────────────
exports.toggleMenuItemFeatured = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    const menuItem = restaurant.menu.id(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, error: "Menu item not found" });
    }

    menuItem.featured = !menuItem.featured;
    await restaurant.save();

    res.json({ success: true, featured: menuItem.featured, data: restaurant });
  } catch (error) {
    console.error("Error toggling featured:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Get all featured items across all restaurants (public, for homepage) ─
exports.getFeaturedItems = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ "menu.featured": true }).lean();
    const result = [];
    restaurants.forEach((r) => {
      (r.menu || []).forEach((m) => {
        if (m.featured) {
          result.push({
            ...m,
            shopName: r.name,
            shopId: r._id,
          });
        }
      });
    });
    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    console.error("Error fetching featured items:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
