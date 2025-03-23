const express = require("express");
const router = express.Router();
const isSignedIn = require("../middleware/is-signed-in");

const {
  addComment,
  deleteComment,
  //   editCommentForm,
  updateComment,
} = require("../controllers/commentController");

//add comment
router.post("/:destinationId/comments", isSignedIn, addComment);

//edit comment
// router.get(
//   "/:destinationId/comments/:commentId/edit",
//   isSignedIn,
//   editCommentForm
// );

router.put("/:destinationId/comments/:commentId", isSignedIn, updateComment);

//delete comment
router.delete("/:destinationId/comments/:commentId", isSignedIn, deleteComment);

module.exports = router;
