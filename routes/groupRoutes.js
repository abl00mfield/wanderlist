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
  editGroupForm,
  deleteGroup,
  updateGroup,
} = require("../controllers/groupController");

const isGroupOwner = require("../middleware/isGroupOwner.js");

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

//display a form to edit the current group
router.get("/:groupId/edit", isGroupOwner, editGroupForm);

//update the group
router.put("/:groupId", isGroupOwner, updateGroup);

//delete the group
router.delete("/:groupId", isGroupOwner, deleteGroup);

//view a specific group and all member destinations
router.get("/:groupId", groupPage);

module.exports = router;
