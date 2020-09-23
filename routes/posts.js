const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");

// api/v1/post
router.route("/").get(auth, getAllPost).post(auth, createPost);

router.route("/:id").put(auth, updatePost).delete(auth, deletePost);

module.exports = router;
