const User = require("../models/user.js");
const Destination = require("../models/destination.js");

exports.allDestinations = async (req, res) => {
  try {
    //get the destinations from the database
    const user = await User.findById(req.session.user._id).populate(
      "destinationIds"
    );

    let destinations = user ? user.destinationIds : [];

    //get a random photo from each destination and create a new
    //destination object with the random photo url to send
    //to the index page
    destinations = destinations.map((destination) => {
      const destinationObj = destination.toObject();

      if (destinationObj.photos.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * destinationObj.photos.length
        );
        destinationObj.randomPhoto = destinationObj.photos[randomIndex].url;
        destinationObj.randomPhotoAlt = destinationObj.photos[randomIndex].alt;
      } else {
        destinationObj.randomPhoto = null;
      }
      return destinationObj;
    });

    res.render("destinations/index.ejs", { destinations });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

exports.createDestination = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.hasBeenVisited = req.body.hasBeenVisited === "on" ? true : false;

    const newDestination = await Destination.create(req.body);

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
    res.render("destinations/show.ejs", { destination, isShowPage: true });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
