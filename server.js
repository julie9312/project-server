const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const path = require("path");

const users = require("./routes/users");
const posts = require("./routes/posts");

const app = express();

app.use(express.json());

app.use("/api/v1/users", users);
app.use("/api/v1/posts", posts);

const PORT = process.env.PORT || 5900;
app.listen(PORT, console.log("서버 실행됨"));
