// 데이터베이스 연결
const connection = require("../db/mysql_connection");

// @desc    모든 메모 가져오기
// @route   GET /api/v1/posts?offset=0&limit=20
// 1. 데이터베이스에 접속해서, 쿼리한다.
// 2. 그 결과를 res 에 담아서 보내준다.
exports.getAllPost = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select * from lcp_post limit ${offset}, ${limit}`;

  try {
    [rows, fileds] = await connection.query(query);
    let count = rows.length;
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
    return;
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "메모를 불러오지 못했습니다",
      error: e,
    });
    return;
  }
};

// @desc    메모 생성하기
// @route   POST /api/v1/posts
// @body    {title:"안녕", body:"좋다"}
exports.createPost = async (req, res, next) => {
  let title = req.body.title;
  let body = req.body.body;
  let query = "insert into lcp_post (title, body) values (? , ?) ";
  let data = [title, body];

  try {
    [result] = await connection.query([data]);
    res.status(200).json({ success: true, result: result });
    return;
  } catch (e) {
    res.console.log(query);
    status(500).json({
      success: false,
      message: "메모를 만들 수 없습니다.",
      error: e,
    });
    return;
  }
};
// @desc    메모 수정하기
// @route   PUT /api/v1/posts/:id
// @request id(auth)
// @body    {title:"안녕", body:"좋다"}
exports.updatePost = async (req, res, next) => {
  let user_id = req.params.id;
  let title = req.body.title;
  let body = req.body.body;

  let query = `update lcp_post 
                set title = "${title}", 
                body = "${body}" 
                where id = ${id} `;

  let query2 = "update lcp_post set title = ? , body = ? where id = ?";

  let data = [user_id, title, body];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
    return;
  } catch (e) {
    res.status(500).json();
    return;
  }
};

// @desc    메모 삭제하기
// @route   DELETE /api/v1/posts/:id
exports.deletePost = async (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "삭제할수 없습니다." });
    return;
  }

  let query = `delete from lcp_post where id = ${id}`;
  let data = [id];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
    return;
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "메모를 삭제할 수 없습니다", error: e });
    return;
  }
};
