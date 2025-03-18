const axios = require("axios");
const Destination = require("../models/destination");

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// 📌 Search for photos on Unsplash
exports.searchPhotos = async (req, res) => {
  try {
    const { query, destinationId } = req.query; // Get search term & destinationId

    if (!query) {
      return res.status(400).send({ error: "Search query is required" });
    }

    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        client_id: UNSPLASH_ACCESS_KEY,
        per_page: 5,
      },
    });

    const photos = response.data.results.map((photo) => ({
      url: photo.urls.regular,
      id: photo.id,
    }));

    res.render("photos/search.ejs", { photos, destinationId });
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    res.status(500).send({ error: "Failed to retrieve photos" });
  }
};

// 📌 Add selected photo to a destination
exports.addPhotoToDestination = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const { destinationId } = req.params;

    if (!photoUrl) {
      return res.status(400).json({ error: "Photo URL is required" });
    }

    await Destination.findByIdAndUpdate(destinationId, {
      $push: { photos: photoUrl },
    });

    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    console.error("Error adding photo:", error);
    res.redirect(`/destinations/${destinationId}`);
  }
};
