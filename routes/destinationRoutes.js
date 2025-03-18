const express = require("express");
const router = express.Router();
//controller logic
const {
  createDestination,
  editDestinationGet,
  editDestinationPut,
  deleteDestination,
  showDestination,
  allDestinations,
} = require("../controllers/destinationController");

const { addPhotoToDestination } = require("../controllers/photoController");

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

router.post("/:destinationId/add-photo", addPhotoToDestination);

module.exports = router;
