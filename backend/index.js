require("dotenv").config(); // to load env variables

const express = require("express"); // to create server
const mongoose = require("mongoose"); // to connect to mongodb
const cors = require("cors"); // to allow cross-origin requests from frontend
const bodyParser = require("body-parser"); // to parse incoming JSON request bodies

const { ShopsModel } = require("./models/ShopsModel");
const { ItemsModel } = require("./models/ItemsModel");
const restaurantRoutes = require("./routes/restaurantRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express(); // create server
const PORT = process.env.PORT || 3001; //if we get port from env file use it 
// else use 3001
const uri = process.env.MONGODB_URL; //connect to mongodb

app.use(cors()); // allow requests from React frontend
app.use(express.json()); // built-in Express 5 JSON parser
app.use(bodyParser.json()); // legacy support


// Auth routes
app.use("/api/auth", authRoutes);

// Location-based Food Recommendation API
app.use("/api/restaurants", restaurantRoutes);


// app.get("/addshops", async(req, res) => {
//     const shopsData = [
//         {
//             name: "Rajesh Kumar",
//             shopid: 101,
//             shopname: "Raj Electronics",
//             city: "Bangalore",
//             state: "Karnataka",
//             pin: 560001,
//             phone: 9876543210,
//             email: "raj.electronics@gmail.com"
//         },
//         {
//             name: "Anita Sharma",
//             shopid: 102,
//             shopname: "Anita Fashion Hub",
//             city: "Mumbai",
//             state: "Maharashtra",
//             pin: 400001,
//             phone: 9823456781,
//             email: "anitafashion@gmail.com"
//         },
//         {
//             name: "Vikram Singh",
//             shopid: 103,
//             shopname: "Vikram Mobiles",
//             city: "Delhi",
//             state: "Delhi",
//             pin: 110001,
//             phone: 9811122233,
//             email: "vikrammobiles@gmail.com"
//         },
//         {
//             name: "Priya Reddy",
//             shopid: 104,
//             shopname: "Priya Super Mart",
//             city: "Hyderabad",
//             state: "Telangana",
//             pin: 500001,
//             phone: 9845098450,
//             email: "priyamart@gmail.com"
//         },
//         {
//             name: "Suresh Patil",
//             shopid: 105,
//             shopname: "Patil Hardware",
//             city: "Pune",
//             state: "Maharashtra",
//             pin: 411001,
//             phone: 9765432109,
//             email: "patilhardware@gmail.com"
//         },
//         {
//             name: "Kiran Das",
//             shopid: 106,
//             shopname: "Kiran Book Store",
//             city: "Kolkata",
//             state: "West Bengal",
//             pin: 700001,
//             phone: 9830011223,
//             email: "kiranbooks@gmail.com"
//         },
//         {
//             name: "Meena Iyer",
//             shopid: 107,
//             shopname: "Meena Cosmetics",
//             city: "Chennai",
//             state: "Tamil Nadu",
//             pin: 600001,
//             phone: 9884455667,
//             email: "meenacosmetics@gmail.com"
//         },
//         {
//             name: "Arjun Mehta",
//             shopid: 108,
//             shopname: "Arjun Sports",
//             city: "Ahmedabad",
//             state: "Gujarat",
//             pin: 380001,
//             phone: 9898989898,
//             email: "arjunsports@gmail.com"
//         },
//         {
//             name: "Deepak Yadav",
//             shopid: 109,
//             shopname: "Yadav Dairy",
//             city: "Lucknow",
//             state: "Uttar Pradesh",
//             pin: 226001,
//             phone: 9797979797,
//             email: "yadavdairy@gmail.com"
//         },
//         {
//             name: "Sneha Nair",
//             shopid: 110,
//             shopname: "Sneha Bakery",
//             city: "Kochi",
//             state: "Kerala",
//             pin: 682001,
//             phone: 9654321876,
//             email: "snehabakery@gmail.com"
//         },
//         {
//             name: "Rohan Gupta",
//             shopid: 111,
//             shopname: "Gupta Furniture",
//             city: "Jaipur",
//             state: "Rajasthan",
//             pin: 302001,
//             phone: 9781234567,
//             email: "guptafurniture@gmail.com"
//         },
//         {
//             name: "Pooja Verma",
//             shopid: 112,
//             shopname: "Pooja Medical Store",
//             city: "Bhopal",
//             state: "Madhya Pradesh",
//             pin: 462001,
//             phone: 9812345670,
//             email: "poojamedical@gmail.com"
//         },
//         {
//             name: "Manoj Joshi",
//             shopid: 113,
//             shopname: "Joshi Stationery",
//             city: "Indore",
//             state: "Madhya Pradesh",
//             pin: 452001,
//             phone: 9822223344,
//             email: "joshistationery@gmail.com"
//         },
//         {
//             name: "Neha Kapoor",
//             shopid: 114,
//             shopname: "Kapoor Jewelry",
//             city: "Chandigarh",
//             state: "Punjab",
//             pin: 160001,
//             phone: 9900112233,
//             email: "kapoorjewelry@gmail.com"
//         },
//         {
//             name: "Amit Kulkarni",
//             shopid: 115,
//             shopname: "Kulkarni Agro Center",
//             city: "Nagpur",
//             state: "Maharashtra",
//             pin: 440001,
//             phone: 9933445566,
//             email: "kulkarniagro@gmail.com"
//         }
//     ];

//     shopsData.forEach((shop) => {
//         let newshop = new ShopsModel({
//             name: shop.name,
//             shopid: shop.shopid,
//             shopname: shop.shopname,
//             city: shop.city,
//             state: shop.state,
//             pin: shop.pin,
//             phone: shop.phone,
//             email: shop.email,
//         });
//         newshop.save();
//     });
//     res.send("Add shops");
// });

// app.get("/getItems", async (req, res) => {
//     const itemsData = [
//         {
//             itemid: 0,
//             itemname: "Sony Home Theatre System",
//             itemprice: 18000,
//             itemquantity: 8,
//             itemdescription: "5.1 channel Dolby surround sound system",
//             itemcategory: "Electronics",
//             shopid: 101
//         },
//         {
//             itemid: 1,
//             itemname: "Dell Inspiron Laptop",
//             itemprice: 65000,
//             itemquantity: 5,
//             itemdescription: "Intel i5 12th Gen, 16GB RAM, 512GB SSD",
//             itemcategory: "Electronics",
//             shopid: 101
//         },
//         {
//             itemid: 2,
//             itemname: "Designer Kurti",
//             itemprice: 1500,
//             itemquantity: 50,
//             itemdescription: "Cotton printed designer kurti for women",
//             itemcategory: "Clothing",
//             shopid: 102
//         },
//         {
//             itemid: 3,
//             itemname: "iPhone 13",
//             itemprice: 52000,
//             itemquantity: 15,
//             itemdescription: "128GB storage, A15 Bionic chip",
//             itemcategory: "Mobiles",
//             shopid: 103
//         },
//         {
//             itemid: 4,
//             itemname: "Basmati Rice 25kg",
//             itemprice: 1800,
//             itemquantity: 40,
//             itemdescription: "Premium quality long grain basmati rice",
//             itemcategory: "Groceries",
//             shopid: 104
//         },
//         {
//             itemid: 5,
//             itemname: "Steel Hammer",
//             itemprice: 450,
//             itemquantity: 30,
//             itemdescription: "Heavy duty steel hammer with rubber grip",
//             itemcategory: "Hardware",
//             shopid: 105
//         },
//         {
//             itemid: 6,
//             itemname: "Engineering Mathematics Book",
//             itemprice: 650,
//             itemquantity: 25,
//             itemdescription: "Comprehensive guide for engineering students",
//             itemcategory: "Books",
//             shopid: 106
//         },
//         {
//             itemid: 7,
//             itemname: "Lakme Face Cream",
//             itemprice: 299,
//             itemquantity: 60,
//             itemdescription: "Moisturizing face cream for daily skincare",
//             itemcategory: "Cosmetics",
//             shopid: 107
//         },
//         {
//             itemid: 8,
//             itemname: "Cricket Bat (Kashmir Willow)",
//             itemprice: 2500,
//             itemquantity: 20,
//             itemdescription: "Lightweight cricket bat for leather ball",
//             itemcategory: "Sports",
//             shopid: 108
//         },
//         {
//             itemid: 9,
//             itemname: "Fresh Cow Milk 1L",
//             itemprice: 60,
//             itemquantity: 100,
//             itemdescription: "Pure and fresh cow milk",
//             itemcategory: "Dairy",
//             shopid: 109
//         },
//         {
//             itemid: 10,
//             itemname: "Chocolate Cake 1kg",
//             itemprice: 700,
//             itemquantity: 15,
//             itemdescription: "Freshly baked chocolate truffle cake",
//             itemcategory: "Bakery",
//             shopid: 110
//         },
//         {
//             itemid: 11,
//             itemname: "Wooden Study Table",
//             itemprice: 5500,
//             itemquantity: 12,
//             itemdescription: "Durable wooden study table with drawers",
//             itemcategory: "Furniture",
//             shopid: 111
//         },
//         {
//             itemid: 12,
//             itemname: "Paracetamol Tablets",
//             itemprice: 40,
//             itemquantity: 200,
//             itemdescription: "Pain relief and fever reducer tablets",
//             itemcategory: "Medical",
//             shopid: 112
//         },
//         {
//             itemid: 13,
//             itemname: "A4 Notebook Pack",
//             itemprice: 120,
//             itemquantity: 80,
//             itemdescription: "Pack of 5 ruled A4 notebooks",
//             itemcategory: "Stationery",
//             shopid: 113
//         },
//         {
//             itemid: 14,
//             itemname: "Gold Plated Necklace",
//             itemprice: 3500,
//             itemquantity: 10,
//             itemdescription: "Traditional gold plated necklace set",
//             itemcategory: "Jewelry",
//             shopid: 114
//         },
//         {
//             itemid: 15,
//             itemname: "Organic Fertilizer 5kg",
//             itemprice: 900,
//             itemquantity: 35,
//             itemdescription: "Eco-friendly organic fertilizer for crops",
//             itemcategory: "Agriculture",
//             shopid: 115
//         }
//     ];

//     itemsData.forEach((item) => {
//         let newItem = new ItemsModel({
//             itemid: item.itemid,
//             itemname: item.itemname,
//             itemprice: item.itemprice,
//             itemquantity: item.itemquantity,
//             itemdescription: item.itemdescription,
//             itemcategory: item.itemcategory,
//             shopid: item.shopid,
//         })
//         newItem.save();
//     });
//     res.send("Items added");
// })

app.get("/allShopsModel", async (req, res) => {
    let allShops = await ShopsModel.find({});
    res.json(allShops);
})

app.get("/allItemsModel", async (req, res) => {
    let allItems = await ItemsModel.find({});
    res.json(allItems);
})

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB");

        // Auto-seed dummy restaurant data if empty
        const Restaurant = require("./models/Restaurant");
        const count = await Restaurant.countDocuments();
        if (count === 0) {
            console.log("No restaurants found, injecting dummy data...");
            const dummyRestaurants = [
                {
                    name: "The Grand Hotel",
                    address: "123 Main Street, City Center",
                    location: { type: "Point", coordinates: [77.5946, 12.9716] },
                    items: ["Pizza", "Pasta", "Burger"],
                    priceRange: 800,
                    rating: 4.5,
                    isOpen: true,
                    mealType: ["lunch", "dinner"],
                    type: "both",
                },
                {
                    name: "Sunrise Budget Hotel",
                    address: "456 Market Road",
                    location: { type: "Point", coordinates: [77.5900, 12.9700] },
                    items: ["Dosa", "Idli", "Coffee"],
                    priceRange: 200,
                    rating: 4.2,
                    isOpen: true,
                    mealType: ["breakfast", "lunch"],
                    type: "veg",
                },
                {
                    name: "Luxury Palace Hotel",
                    address: "789 Hilltop Avenue",
                    location: { type: "Point", coordinates: [77.6000, 12.9800] },
                    items: ["Steak", "Sushi", "Wine"],
                    priceRange: 3000,
                    rating: 4.8,
                    isOpen: true,
                    mealType: ["dinner"],
                    type: "non-veg",
                }
            ];
            await Restaurant.insertMany(dummyRestaurants);
            console.log("Dummy restaurants added successfully!");
        }

        // Seed default admin account
        const User = require("./models/User");
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            console.log("Creating default admin account...");
            const adminUser = new User({
                name: "BiteBox Admin",
                email: "admin@bitebox.com",
                password: "admin123",
                role: "admin",
            });
            await adminUser.save();
            console.log("Default admin created: admin@bitebox.com / admin123");
        }
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB:", err.message);
        console.log("Please check your MongoDB Atlas connection string in the .env file.");
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
