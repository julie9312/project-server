const jwt = require("jsonwebtoken");
const connection = require("../db/mysql_connection");

const auth = async (req, res, next) => {
  let token;
  try {
    token = req.header("Authorization");
    token = token.replace("Bearer ", "");
  } catch (e) {
    res.status(404).json();
    return;
  }

  let user_id;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    user_id = decoded.user_id;
  } catch (e) {
    res.status(405).json();
    return;
  }

  //user_id 랑 토큰을 가지고 커리를 한다

  let query = `select u.id, t.user_id, p.id
  from lcp_user as u
  join lcp_token as t 
  on t.user_id = u.id
  join lcp_post as p
  on t.user_id = p.id
  where t.user_id =?  and u.id = ? and p.id =?`;

  let data = [user_id, token];

  try {
    [rows] = await connection.query(query, data);
    if (rows.length == 0) {
      res.status(400).json();
      return;
    } else {
      req.user = rows[0];
      next();
    }
  } catch (e) {
    res.status(500).json();
    return;
  }
};

module.exports = auth;
