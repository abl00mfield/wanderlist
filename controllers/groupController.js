const Group = require("../models/group.js");
const User = require("../models/user.js");

//show a form to create a new group
exports.newGroupForm = (req, res) => {
  res.render("groups/new.ejs");
};

exports.allGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("owner", "username");
    const userId = req.session.user._id;
    res.render("groups/index.ejs", { groups, userId });
  } catch (error) {
    console.log("Error fetching groups: ", error);
  }
};

//create a new group
exports.createGroup = async (req, res) => {
  try {
    //create a new group, current user is owner and member of group
    const group = await Group.create({
      name: req.body.name,
      owner: req.session.user._id,
      members: [req.session.user._id],
    });

    //add group to user
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { groupIds: group._id },
    });

    res.redirect("/groups");
  } catch (error) {
    console.log("Error creating group", error);
    res.redirect("/");
  }
};

//join a group
exports.joinGroup = async (req, res) => {
  try {
    //get the group id from the request url params
    const groupId = req.params.groupId;
    // get the user from the session
    const userId = req.session.user._id;

    //add user to group if not already member
    await Group.findByIdAndUpdate(groupId, {
      $addToSet: { members: userId },
    });

    //add group to user's groupIds
    await User.findByIdAndUpdate(userId, {
      $addToSet: { groupIds: groupId },
    });

    res.redirect(`/groups/${groupId}`);
  } catch (error) {
    console.log("Error joining group: ", error);
    res.redirect("/");
  }
};

exports.myGroups = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate("groupIds");
    res.render("groups/my-groups/index.ejs", { groups: user.groupIds });
  } catch (error) {
    console.log("Error loading user groups: ", error);
    res.redirect("/");
  }
};

//view one group and all member destinations
exports.groupPage = async (req, res) => {
  try {
    //get all the members from the group
    const group = await Group.findById(req.params.groupId).populate("members");

    const users = await User.find({
      //find all users whose _id is in the array group.members
      _id: { $in: group.members },
    }) //get all of their destinations
      .populate("destinationIds");

    //put all of the destinations in a single array
    const destinations = users.flatMap((user) => user.destinationIds);

    res.render("groups/show.ejs", { group, destinations });
  } catch (error) {
    console.log("Error loading group page:", error);
    res.redirect("/groups/my-groups");
  }
};
