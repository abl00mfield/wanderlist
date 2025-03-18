const User = require("../models/user.js");
const Destination = require("../models/destination.js");

exports.allDestinations = async (req, res) => {
  console.log("getting all destinations");
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
    // console.log("req body: ", req.body);
    const newDestination = await Destination.create(req.body);
    // console.log("created destination: ", newDestination);
    currentUser.destinationIds.push(newDestination._id);
    await currentUser.save();
    res.redirect("/destinations");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
exports.editDestinationGet = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.destinationId);
    if (!destination) {
      return res.status(404).send({ error: "Destination not found" });
    }
    res.render("destinations/edit.ejs", { destination });
  } catch (error) {
    console.log("Error fetching destination for Edit", error);
    res.redirect("/destinations");
  }
};

exports.editDestinationPut = async (req, res) => {
  try {
    const { destinationId } = req.params;
    //convert checkbox to boolean
    req.body.hasBeenVisited = req.body.hasBeenVisited === "on";
    await Destination.findByIdAndUpdate(destinationId, req.body, { new: true });
    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    console.log("Error updating Destination ", error);
    res.redirect("/destinations");
  }
};

//logic to DELETE a destination
exports.deleteDestination = async (req, res) => {
  try {
    //get destinnation Id from params
    const { destinationId } = req.params;
    //get userId from session
    const userId = req.session.user._id;
    //delete the destination from the collection
    const deletedDestination = await Destination.findByIdAndDelete(
      destinationId
    );
    console.log("DELETED DESTINATION: ", deletedDestination);

    if (!deletedDestination) {
      return res.status(404).send({ error: "Destination not found" });
    }
    //delete the reference in the User
    await User.findByIdAndUpdate(userId, {
      $pull: { destinationIds: destinationId },
    });

    res.redirect("/destinations");
  } catch (error) {
    console.log("Error deleting destination", error);
    res.redirect("/");
  }
};

exports.showDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.destinationId);
    res.render("destinations/show.ejs", { destination });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
