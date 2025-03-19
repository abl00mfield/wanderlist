const axios = require("axios");
require("dotenv").config();
const { cloudinary } = require("../config/cloudinary");
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

  try {
    const { photoData } = req.body;

    const [photoUrl, photoAlt] = photoData.split("|");

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

    const imgUrl = req.file.path; //get url from the request body
    await Destination.findByIdAndUpdate(destinationId, {
      $push: { photos: { url: imgUrl, alt: alt || "User upload photo" } },
    });

    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    // console.log("Error uploading to Cloudinary: ", error);
    // res.redirect(`/destinations/${destinationId}`);
    res.send("error: ", error);
  }
};

exports.removeDestinationPhoto = async (req, res) => {
  const { destinationId, photoUrl } = req.params;
  try {
    //get cloudinary ID from URL
    const publicId = photoUrl.split("/").pop().split(".")[0];
    //remove from cloudinary storage
    await cloudinary.uploader.destroy(publicId);

    await Destination.findByIdAndUpdate(
      destinationId,
      {
        //we have to decode out the special chars that are in a URL before passing to the DB
        $pull: { photos: { url: decodeURIComponent(photoUrl) } },
      },
      { new: true }
    );
    res.redirect(`/destinations/${destinationId}/edit`);
  } catch (error) {
    console.log("Error removing Photo ", error);
    res.redirect(`/destinations/${destinationId}/edit`);
  }
};
