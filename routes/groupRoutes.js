const express = require("express");
const router = express.Router();

const {
  newGroupForm,
  createGroup,
  joinGroup,
  myGroups,
  groupPage,
  viewGroups,
} = require("../controllers/groupController");

const isSignedIn = require("../middleware/is-signed-in.js");

//show form to create a new group
router.get("/new", isSignedIn, newGroupForm);

//create a new group
router.post("/new", isSignedIn, createGroup);

//join a group
router.post("/:groupId/join", isSignedIn, joinGroup);

//view all groups a user belongs to
router.get("/my-groups", isSignedIn, myGroups);

//view a specific group and all member destinations
router.get("/:groupId", isSignedIn, groupPage);

router.get("/", isSignedIn, viewGroups);

module.exports = router;
