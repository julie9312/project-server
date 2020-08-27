const express = require("express");
const dotenv = require("dotenv");

const path = require("path");

const users = require("./routes/users");
const memo = require("./routes/memos");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json());

app.use("/api/v1/users", users);
app.use("/api/v1/memos", memo);

const PORT = process.env.PORT || 5900;
app.listen(PORT, console.log("서버 실행됨"));
