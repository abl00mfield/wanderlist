const express = require("express");
const router = express.Router();

const {
  newGroupForm,
  createGroup,
  joinGroup,
  myGroups,
  groupPage,
  allGroups,
  leaveGroup,
} = require("../controllers/groupController");

const isSignedIn = require("../middleware/is-signed-in.js");

//get all the groups that exist
router.get("/", isSignedIn, allGroups);

//show form to create a new group
router.get("/new", isSignedIn, newGroupForm);

//create a new group
router.post("/new", isSignedIn, createGroup);

//view all groups a user belongs to
router.get("/my-groups", isSignedIn, myGroups);

//join a group
router.patch("/:groupId/join", isSignedIn, joinGroup);

//leave a group
router.patch("/:groupId/leave", isSignedIn, leaveGroup);

//view a specific group and all member destinations
router.get("/:groupId", isSignedIn, groupPage);

module.exports = router;
