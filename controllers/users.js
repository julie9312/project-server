const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//데이터베이스연결
const connection = require("../db/mysql_connection");

// @desc    회원가입
// @route   POST    /api/v1/users
// @parameters  email, passwd
exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  let passwd_hint = req.body.passwd_hint;

  // npm validator
  if (!validator.isEmail(email)) {
    res.status(400).json();
    return;
  }

  // npm bcryptjs.
  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = `insert into lcp_user (email, passwd, passwd_hint) values (?,?,?)`;
  let data = [email, hashedPasswd, passwd_hint];
  let user_id;
  try {
    [result] = await connection.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    res.status(500).json();
    return;
  }

  // 토큰 처리  npm jsonwebtoken
  // 토큰 생성 sign
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = `insert into lcp_token (token, user_id) values (? , ? )`;
  data = [token, user_id];

  try {
    [result] = await connection.query(query, data);
  } catch (e) {
    res.status(500).json({error :e});
    return;
  }

  res.status(200).json({ success: true, token: token });
};

// @desc        로그인
// @route       POST    /api/v1/users/login
// @parameters  email, passwd
exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  if (!email || !passwd) {
    res.status(400).json();
    return;
  }

  let query = `select * from lcp_user where email = ?`;
  let data = [email];
  let user_id;
  try {
    [rows] = await connection.query(query, data);
    let hashedPasswd = rows[0].passwd;
    user_id = rows[0].id;
    const isMatch = await bcrypt.compare(passwd, hashedPasswd);
    if (isMatch == false) {
      res.status(400).json({success: false, msg:  "login error"});
      return;
    }
  } catch (e) {
    res.status(500).json({error : e});
    return;
  }
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = `insert into lcp_token (token, user_id) values (?, ?)`;
  data = [token, user_id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(500).json({error : e});
  }
};

// @desc    로그아웃 (현재의 기기 1개에 대한 로그아웃)
// @route   DELETE/api/v1/users/logout
// @request user_id(auth)
// @response  success

exports.logout = async (req, res, next) => {
  // lcp_token 테이블에서, 토큰 삭제해야 로그아웃이 되는것이다.

  let user_id = req.user.id;
  let token = req.user.token;

  let query = `delete from lcp_token where user_id = ? and token = ? `;
  let data = [user_id, token];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({success :false, error :e });
  }
};

// @desc    비밀번호 초기화
// @route   PUT/api/v1/users/email
// @request email, passwdHint
// @response  success, passwd

exports.passwdInit = async (req, res, next) => {
  let email = req.body.email;
  let passwd_hint = req.body.passwd_hint;

  let query = `select passwd_hint from lcp_user where email = "${email}" `;
  let data = [email];
  try {
    [rows] = await connection.query(query, data);
    if (rows[0].passwd_hint !== passwd_hint) {
      res.status(401).json({ success: false, rows });
      return;
    }
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }

  // 랜덤으로 문자열 생성 (6자리)

  let newPasswd = Math.random().toString(36).substr(2, 6);
  const hashedPasswd = await bcrypt.hash(newPasswd, 8);

  query = `update lcp_user set passwd = ? where email = ? `;

  data = [hashedPasswd, email];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, passwd: newPasswd });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
};
