const mongoose = require("mongoose");
const User = require("../models/user");
const Destination = require("../models/destination");

const MONGODB_URI =
  "mongodb+srv://amandabloomfield:oANrNFPw4LM4itU2@student-cluster.q5th6.mongodb.net/wanderlist?retryWrites=true&w=majority&appName=student-cluster";

async function runBackFill() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to DB");

    const user = await User.findOne({ username: "amanda" });

    if (!user) {
      throw new Error("user not found");
    }
    const result = await Destination.updateMany(
      { user: { $exists: false } },
      { $set: { user: user._id } }
    );

    console.log(
      `Updated ${result.modifiedCount || result.nModified} destinations.`
    );
  } catch (error) {
    console.log("Migration failed: ", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

runBackFill();
