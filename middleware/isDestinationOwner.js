const Destination = require("../models/destination");

module.exports = async (req, resizeBy, next) => {
  const { destinationId } = req.params;
  const userId = req.session.user?._id;

  try {
    const destination = await Destination.findById(destinationId);

    if (!destination || destination.user.toString() !== userId) {
      return res
        .status(403)
        .send("You are not authorized to modify this destination");
    }

    next();
  } catch (error) {
    console.log("Ownership check failed:", error);
    res.redirect("/");
  }
};
