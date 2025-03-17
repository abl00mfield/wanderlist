//all the routes for authorization

const express = require("express");
const router = express.Router();

//the controller logic
const { signOut, signUp, signIn } = require("../controllers/authController");

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.get("/sign-out", signOut);
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

module.exports = router;
