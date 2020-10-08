const express = require("express");
const auth = require("../middleware/auth");
const {
  createUser,
  loginUser,
  logout,
  passwdInit,
} = require("../controllers/users");

const router = express.Router();

// api/v1/users
router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").delete(auth, logout);
router.route("/").put(passwdInit);

module.exports = router;
