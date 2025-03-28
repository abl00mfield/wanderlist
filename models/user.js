const mongoose = require("mongoose");
const Destination = require("./destination");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  destinationIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
