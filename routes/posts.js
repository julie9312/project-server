const express = require("express");
const router = express.Router();
const {
  allPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");

router.route("/").get(allPost).post(createPost);

router.route("/:id").put(updatePost).delete(deletePost);

module.exports = router;
