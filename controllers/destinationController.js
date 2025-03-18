const User = require("../models/user.js");
const Destination = require("../models/destination.js");

exports.allDestinations = async (req, res) => {
  try {
    const { destinationIds: destinations } = (await User.findById(
      req.session.user._id
    ).populate("destinationIds")) || { destinationIds: [] };

    res.render("destinations/index.ejs", {
      destinations,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

exports.createDestination = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.hasBeenVisited = req.body.hasBeenVisited === "on" ? true : false;
    console.log("req body: ", req.body);
    const newDestination = await Destination.create(req.body);
    console.log("created destination: ", newDestination);
    currentUser.destinationIds.push(newDestination._id);
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

exports.showDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.destinationId);
    res.render("destinations/show.ejs", { destination });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
