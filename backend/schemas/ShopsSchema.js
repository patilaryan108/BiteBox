const { Schema } = require("mongoose");
// define schema for holding

const ShopsSchema = new Schema({ //attributes
    name: String,
    shopid: Number,
    shopname: String,
    city: String,
    state: String,
    pin: Number,
    phone: Number,
    email: String,
})

module.exports = { ShopsSchema };