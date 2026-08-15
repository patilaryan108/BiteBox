const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: "", trim: true },
  image: { type: String, default: "" }, // URL or base64 image
  featured: { type: Boolean, default: false }, // show on homepage hero sections
  type: { type: String, default: "lunch" },
});

const reviewSchema = require("./Review");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    // Legacy string items — kept for backward-compat & text search
    items: { type: [String], default: [] },
    // Rich menu items (with price, description)
    menu: { type: [menuItemSchema], default: [] },
    priceRange: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isOpen: { type: Boolean, default: true },
    type: { type: String, enum: ["veg", "non-veg", "both"], default: "both" },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

restaurantSchema.index({ location: "2dsphere" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
