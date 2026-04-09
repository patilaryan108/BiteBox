const { Schema } = require("mongoose");

const ItemsSchema = new Schema({
    itemid: Number,
    itemname: String,
    itemprice: Number,
    itemquantity: Number,
    itemdescription: String,
    itemcategory: String,
    shopid: Number,
})

module.exports = { ItemsSchema };
