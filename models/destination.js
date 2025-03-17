const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  hasBeenVisited: { type: Boolean, default: false },
  notes: { type: String },
  photos: [String],
});

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
