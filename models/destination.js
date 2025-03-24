const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  hasBeenVisited: { type: Boolean, default: false },
  notes: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  photos: [
    {
      url: { type: String },
      alt: { type: String, default: "Destination photo" },
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
