const { model } = require("mongoose");
const { ShopsSchema } = require("../schemas/ShopsSchema");

const ShopsModel = model("Shop", ShopsSchema);

module.exports = { ShopsModel };