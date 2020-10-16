// 데이터베이스 연결
const connection = require("../db/mysql_connection");

// @desc    내가 쓴 모든 메모 가져오기
// @route   GET /api/v1/posts/me?offset=0&limit=25
// @request user_id(auth), offset, limit
// @response  success, items[], cnt
// 1. 데이터베이스에 접속해서, 쿼리한다.
// 2. 그 결과를 res 에 담아서 보내준다.
exports.getAllPost = async (req, res, next) => {
  let user_id = req.user.id;
  let offset = req.query.offset;
  let limit = req.query.limit;

  if (!user_id || !offset || !limit) {
    res.status(400).json({ message: "파라미터가 잘 못 되었습니다." });
    return;
  }
  let query = `select * from lcp_post where user_id = ? order by id desc limit ?,?;`;
  let data = [user_id, Number(offset), Number(limit)];
  try {
    [rows] = await connection.query(query, data);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
    return;
  } catch (e) {
    res.status(500).json({error :e});
    return;
  }
};

// @desc    메모 생성하기
// @route   POST /api/v1/posts
// @body    {title:"안녕", content:"좋다"}
exports.createPost = async (req, res, next) => {
  let user_id = req.user.id;
  let title = req.body.title;
  let content = req.body.content;
  let query =
    "insert into lcp_post (user_id, title, content) values (?, ? , ?) ";
  let data = [user_id, title, content];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
    return;
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "메모를 만들 수 없습니다.", error: e });
    return;
  }
};

// @desc    메모 수정하기
// @route   PUT /api/v1/posts/:post_id
// @request user_id(auth)
// @body    {title:"안녕", content:"싫다"}
exports.updatePost = async (req, res, next) => {
  let post_id = req.params.post_id;
  let user_id = req.user.id;
  let title = req.body.title;
  let content = req.body.content;
  // 이 사람의 포스팅을 변경하는지 확인 한다.
  let query = `select * from lcp_post where id = ?`;
  let data = [post_id];

  try {
    [rows] = await connection.query(query, data);
    if (rows[0].user_id != user_id) {
      req.status(401).json;
      return;
    }
  } catch (e) {
    res.status(500).json();
    return;
  }

  query = `update lcp_post 
                set title = ?, 
                content = ? 
                where id = ?`;

  data = [title, content, post_id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
    return;
  } catch (e) {
    res.status(500).json({error : e});
    return;
  }
};

// @desc    메모 삭제하기
// @route   DELETE /api/v1/posts/:id
// @request post_id, user_id(auth)
// @response  success

exports.deletePost = async (req, res, next) => {
  let post_id = req.params.post_id;
  let user_id = req.user.id;
  if (!post_id || !user_id) {
    res.status(400).json({ error :e , message: "삭제할수 없습니다." });
    return;
  }

  // 이 사람의 포스팅이 맞는지 확인
  let query = `select * from lcp_post where id = ?`;
  let data = [post_id];
  try {
    [rows] = await connection.query(query, data);
    // 다른사람 포스팅이면, 401로 보낸다.
    if (rows[0].user_id != user_id) {
      req.status(401).json({error : e});
      return;
    }
  } catch (e) {
    res.status(500).json({error :e});
    return;
  }
  // 확인 완료 했으면 삭제하기
  query = `delete from lcp_post where id = ? `;
  data = [post_id];
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
