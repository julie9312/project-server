const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");

// api/v1/posts
router.route("/me").get(auth, getAllPost);
router.route("/").post(auth, createPost);
router.route("/:post_id").put(auth, updatePost).delete(auth, deletePost);

module.exports = router;
