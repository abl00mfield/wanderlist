const Destination = require("../models/destination");

exports.addComment = async (req, res) => {
  const { destinationId } = req.params;
  const userId = req.session.user._id;
  const { text } = req.body;

  try {
    await Destination.findByIdAndUpdate(destinationId, {
      $push: {
        comments: {
          user: userId,
          text,
          createdAt: new Date(),
        },
      },
    });

    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    console.log("Error adding comment: ", error);
    res.redirect(`/destinations/${destinationId}`);
  }
};

exports.updateComment = async (req, res) => {
  const { destinationId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.session.user._id;

  try {
    //find the destination
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).sent("Comment not found");
    }
    //find the specific comment
    const comment = destination.comments.id(commentId);

    if (comment.user.toString() != userId) {
      return res
        .status(403)
        .send("You are not authorized to edit this comment");
    }
    //update the comment
    comment.text = text;
    await destination.save();
    res.redirect(`/destinations/${destinationId}`);
  } catch (error) {
    console.log("Error updating comment: ", error);
    res.redirect(`/destinations/${destinationId}`);
  }
};

// exports.updateComment = async (req, res) => {};

exports.deleteComment = async (req, res) => {
  const { destinationId, commentId } = req.params;
  const destination = await Destination.findById(destinationId);

  destination.comments = destination.comments.filter((comment) => {
    return (
      comment._id.toString() != commentId ||
      comment.user.toString() !== req.session.user._id
    );
  });

  await destination.save();
  res.redirect(`/destinations/${destinationId}`);
};
