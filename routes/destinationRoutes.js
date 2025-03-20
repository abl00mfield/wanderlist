const express = require("express");
const router = express.Router();

//photo upload package
const multer = require("multer");
//configure multer to store files in memory
const { storage } = require("../config/cloudinary");
//limit to 2MB
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadErrorHandler = require("../middleware/upload-error-handler.js");
//controller logic
const {
  createDestination,
  editDestinationGet,
  editDestinationPut,
  deleteDestination,
  showDestination,
  allDestinations,
} = require("../controllers/destinationController");

const {
  addPhotoToDestination,
  uploadUserPhoto,
  removeDestinationPhoto,
} = require("../controllers/photoController");

//index page, show all destinations
router.get("/", allDestinations);

//links to form to input information about a destination
router.get("/new", (req, res) => {
  res.render("destinations/new.ejs");
});

//POST route to create a new destination
router.post("/", createDestination);

//GET route to show a single destination
router.get("/:destinationId", showDestination);

//DELETE route to delete a destination
router.delete("/:destinationId", deleteDestination);

//GET route to edit a destination, links to page
//with a form to edit
router.get("/:destinationId/edit", editDestinationGet);

//PUT route to update the database with the edited destination
router.put("/:destinationId", editDestinationPut);

//DELETE route to delete a user selected photo
router.delete("/:destinationId/photos/:photoUrl", removeDestinationPhoto);

//POST route to add a photo to a destination
router.post("/:destinationId/add-photo", addPhotoToDestination);

//POST route to add an uploaded photo to a destination
router.post(
  "/:destinationId/upload-photo",
  upload.single("photo"),
  uploadErrorHandler,
  uploadUserPhoto
);

module.exports = router;
