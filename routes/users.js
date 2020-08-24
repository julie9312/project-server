const express = require("express");
const { createUser, login } = require("../db/controllers/users");
const auth = require("../middleware/auth");

const router = express.Router();

//api/v1/users

router.route("/").post(createUser);
router.route("/login").post(login);

module.exports = router;
