const Group = require("../models/group");

module.exports = async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.session.user._id;

  try {
    const group = await Group.findById(groupId);
    if (!group || group.owner.toString() != userId) {
      return res
        .status(403)
        .send("You are not authorized to perform this action");
    }
    next();
  } catch (error) {
    console.log("Group ownership check failed:", error);
    res.redirect("/groups");
  }
};
