require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");

const customShops = [
  {
    name: "Desi Dhaba",
    address: "101 Grand Trunk Road",
    location: { type: "Point", coordinates: [77.6, 12.95] },
    items: ["Poori Bhaji", "Kokani Thali", "Carrots", "Beetroot", "Fresh Milk", "Dahi (Curd)", "Butter Milk"],
    priceRange: 150,
    rating: 4.6,
    isOpen: true,
    type: "veg"
  },
  {
    name: "Healthy Eats",
    address: "Green Valley Circle",
    location: { type: "Point", coordinates: [77.65, 12.9] },
    items: ["Dal Khichdi", "Broccoli", "Spinach", "Tomatoes", "Pure Ghee"],
    priceRange: 250,
    rating: 4.8,
    isOpen: true,
    type: "both"
  },
  {
    name: "Spice Garden",
    address: "MG Road Plaza",
    location: { type: "Point", coordinates: [77.61, 12.96] },
    items: ["Marathi Thali", "Chicken Biryani", "Capsicum", "Paneer", "Cheese Slice"],
    priceRange: 400,
    rating: 4.7,
    isOpen: true,
    type: "non-veg"
  }
];

mongoose
  .connect("mongodb+srv://bitebox:bitebox@cluster0.xdbfep9.mongodb.net/Hotel?appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB");
    
    const results = [];
    for (const shop of customShops) {
      // Check if exists
      let existing = await Restaurant.findOne({ name: shop.name });
      if (!existing) {
        existing = await Restaurant.create(shop);
        console.log(`Created: ${existing.name} with ID ${existing._id}`);
      } else {
        console.log(`Found: ${existing.name} with ID ${existing._id}`);
      }
      results.push({ name: existing.name, id: existing._id });
    }
    
    console.log("--- IDs ---");
    console.log(JSON.stringify(results));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error", err);
    process.exit(1);
  });
