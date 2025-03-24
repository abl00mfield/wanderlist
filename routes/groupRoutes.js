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
router.get("/", allGroups);

//show form to create a new group
router.get("/new", newGroupForm);

//create a new group
router.post("/new", createGroup);

//view all groups a user belongs to
router.get("/my-groups", myGroups);

//join a group
router.patch("/:groupId/join", joinGroup);

//leave a group
router.patch("/:groupId/leave", leaveGroup);

//view a specific group and all member destinations
router.get("/:groupId", groupPage);

module.exports = router;
