require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");

const dummyRestaurants = [
  {
    name: "The Grand Hotel",
    address: "123 Main Street, City Center",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716], // Example: Bangalore coordinates [lng, lat]
    },
    items: ["Pizza", "Pasta", "Burger"],
    priceRange: 800,
    rating: 4.5,
    isOpen: true,
    type: "both",
  },
  {
    name: "Sunrise Budget Hotel",
    address: "456 Market Road",
    location: {
      type: "Point",
      coordinates: [77.5900, 12.9700],
    },
    items: ["Dosa", "Idli", "Coffee"],
    priceRange: 200,
    rating: 4.2,
    isOpen: true,
    type: "veg",
  },
  {
    name: "Luxury Palace Hotel",
    address: "789 Hilltop Avenue",
    location: {
      type: "Point",
      coordinates: [77.6000, 12.9800],
    },
    items: ["Steak", "Sushi", "Wine"],
    priceRange: 3000,
    rating: 4.8,
    isOpen: true,
    type: "non-veg",
  }
];

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("Connected to MongoDB");
    // Clear existing data
    await Restaurant.deleteMany({});
    console.log("Cleared existing restaurants");
    
    // Insert new dummy data
    await Restaurant.insertMany(dummyRestaurants);
    console.log("Dummy restaurants added successfully!");
    
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });
