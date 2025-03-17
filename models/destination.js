const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  hasBeenVisited: { type: Boolean, default: false },
  notes: { type: String },
  photos: [String],
});
