//all the routes for authorization

const express = require("express");
const router = express.Router();

//the controller logic
const {
  signUpGet,
  signInGet,
  signOut,
  signUpPost,
  signInPost,
} = require("../controllers/authController");

router.get("/sign-up", signUpGet);
router.get("/sign-in", signInGet);
router.get("/sign-out", signOut);
router.post("/sign-up", signUpPost);
router.post("/sign-in", signInPost);

module.exports = router;
