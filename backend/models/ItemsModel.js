const { model } = require("mongoose");
const { ItemsSchema } = require("../schemas/ItemsSchema");

const ItemsModel = model("Item", ItemsSchema);

module.exports = { ItemsModel };