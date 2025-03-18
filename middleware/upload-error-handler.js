const Destination = require("../models/destination");

const uploadErrorHandler = async (err, req, res, next) => {
  if (err) {
    console.error("File Upload Error: ", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      console.log("***in error message***");
      const destinationId = req.params.destinationId || req.body.destinationId;
      const destination = await Destination.findById(destinationId);
      console.log("DESTINATION: ", destination);
      return res.render("destinations/show.ejs", {
        destination,
        error: "File too large. Maximum size is 2MB",
      });
    }
    return res.status(500).send({ error: "File upload failed" });
  }
  next();
};

module.exports = uploadErrorHandler;
