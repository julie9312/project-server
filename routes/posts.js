const express = require("express");
const router = express.Router();
const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");

router.route("/").get(getAllPost).post(createPost);

router.route("/:id").put(updatePost).delete(deletePost);

module.exports = router;
