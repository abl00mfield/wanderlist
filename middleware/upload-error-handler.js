const Destination = require("../models/destination");

//provides a useful message to the user if their file it too large
const uploadErrorHandler = async (err, req, res, next) => {
  if (err) {
    console.error("File Upload Error: ", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      const destinationId = req.params.destinationId || req.body.destinationId;
      const destination = await Destination.findById(destinationId);

      return res.render("destinations/show.ejs", {
        destination,
        error: "File too large. Maximum size is 5MB",
        isShowPage: true,
      });
    }
    return res.status(500).send({ error: "File upload failed" });
  }
  next();
};

module.exports = uploadErrorHandler;
