const axios = require("axios");
require("dotenv").config();
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
      alt: photo.alt_description || "photo from Unsplash",
    }));

    res.render("photos/search.ejs", { photos, destinationId });
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    res.status(500).send({ error: "Failed to retrieve photos" });
  }
};

// 📌 Add selected photo to a destination
exports.addPhotoToDestination = async (req, res) => {
  const { destinationId } = req.params;
  console.log(req.body);

  try {
    const { photoData } = req.body;
    console.log("photo Data", photoData);
    const [photoUrl, photoAlt] = photoData.split("|");
    console.log("photo url: ", photoUrl);
    console.log("photo Alt: ", photoAlt);

    if (!photoUrl) {
      return res.status(400).send({ error: "Photo URL is required" });
    }

    await Destination.findByIdAndUpdate(destinationId, {
      $push: { photos: { url: photoUrl, alt: photoAlt || "Destinaton Photo" } },
    });

    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    console.error("Error adding photo:", error);
    res.redirect(`/destinations/${destinationId}`);
  }
};

exports.uploadUserPhoto = async (req, res) => {
  const { destinationId } = req.params;
  const { alt } = req.body;
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }
    const imageBase64 = req.file.buffer.toString("base64");
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      { image: imageBase64 },
      { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
    );

    const imgUrl = response.data.data.link;

    await Destination.findByIdAndUpdate(destinationId, {
      $push: { photos: { url: imgUrl, alt: alt || "User upload photo" } },
    });

    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    console.log("Error uploading to imgur: ", error);
    res.redirect(`/destinations/${destinationId}`);
  }
};

exports.removeDestinationPhoto = async (req, res) => {
  const { destinationId, photoUrl } = req.params;
  console.log("DESTINATION ID", destinationId);
  console.log("photo URL ", decodeURIComponent(photoUrl));
  try {
    await Destination.findByIdAndUpdate(destinationId, {
      //we have to decode out the special chars that are in a URL before passing to the DB
      $pull: { photos: { url: decodeURIComponent(photoUrl) } },
    });
    res.redirect(`/destinations/${destinationId}/edit`);
  } catch (error) {
    console.log("Error removing Photo ", error);
    res.redirect(`/destinaitons/${destinationId}/edit`);
  }
};
