const express = require("express");
const router = express.Router();

const { searchPhotos } = require("../controllers/photoController");

// GET route to search for photos
router.get("/search", searchPhotos);

module.exports = router;
