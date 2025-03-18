const express = require("express");
const router = express.Router();

const { searchPhotos } = require("../controllers/photoController");

// GET route to search for photos
router.get("/search", searchPhotos);

//POST route to add a selected photo to a destination

module.exports = router;
