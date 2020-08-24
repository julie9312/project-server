const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../db/mysql_connection");

// @desc        회원가입
// @route       POST /api/v1/users
// @request     email, passwd
// @response    success, token

exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = "insert into lcp_user (email, passwd) values(?,?)";
  let data = [email, hashedPasswd];

  let user_id;
  try {
    [result] = await connection.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    res.status(500).json();
    return;
  }

  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);

  query = "insert into lcp_token (user_id, token) values (?,?)";
  data = [user_id, token];

  try {
    [result] = await connection.query(query, data);
  } catch (e) {
    res.status(500).json();
    return;
  }

  res.status(200).json({ success: true, token: token });
};

// @desc    로그인
// @route   POST /api/v1/users/login
// @request email, passwd
// @response  success
exports.login = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  if (!email || !passwd) {
    res.status(400).json();
    return;
  }

  let query = "select * from lcp_user where email = ? ";
  let data = [email];

  let user_id;
  try {
    [rows] = await connection.query(query, data);
    let hashedPasswd = rows[0].passwd;
    user_id = rows[0].id;
    const isMatch = await bcrypt.compare(passwd, hashedPasswd);
    if (isMatch == false) {
      res.status(400).json();
      return;
    }
  } catch (e) {
    res.status(500).json();
    return;
  }

  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);

  query = "insert into lcp_token (token, user_id) values (?,?) ";
  data = [token, user_id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, token: token });
    return;
  } catch (e) {
    res.status(500).json();
    return;
  }
};
