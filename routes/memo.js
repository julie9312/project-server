const express = require("express");
const auth = require("../middleware/auth");
const { createMemo, getMemos, updateMemo } = require("../controllers/memo");

const router = express.Router();

//api/v1/memos

router.route("/").post(createMemo).get(getMemos);
router.route("/login").update(updateMemo);

module.exports = router;
