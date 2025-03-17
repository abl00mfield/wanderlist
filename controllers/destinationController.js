const User = require("../models/user.js");
const Destination = require("../models/destination.js");

exports.allDestinations = async (req, res) => {};
exports.createDestination = async (req, res) => {
  try {
    const currentUser = await User.findById(req.locals.user._id);
    const newDestination = await Destination.create(req.body);
    currentUser.destinations.push(newDestination._id);
    await currentUser.save();
    res.redirect("/destinations");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
exports.editDestinationGet = async (req, res) => {};
exports.editDestinationPut = async (req, res) => {};
exports.deleteDestination = async (req, res) => {};
exports.showDestination = async (req, res) => {};
