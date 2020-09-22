// 데이터베이스 연결
const connection = require("../db/mysql_connection");

// @desc    모든 메모 가져오기
// @route   GET /api/v1/post
// 1. 데이터베이스에 접속해서, 쿼리한다.
// 2. 그 결과를 res 에 담아서 보내준다.
exports.getAllPost = function (req, res, next) {
  let query = "select * from lcp_post;";
  connection.query(query, function (error, results, fields) {
    console.log(error);
    res.status(200).json({
      success: true,
      results: {
        items: results,
      },
    });
  });
};

// @desc    메모 생성하기
// @route   POST /api/v1/post
// @body    {title:"안녕", body:"좋다"}
exports.createPost = (req, res, next) => {
  let title = req.body.title;
  let body = req.body.body;
  let query = "insert into lcp_post (title, body) values (? , ?) ";
  connection.query(query, [title, body], function (error, results, fields) {
    console.log(results);
    res.status(200).json({ success: true });
  });
};

// @desc    메모 수정하기
// @route   PUT /api/v1/posts/:id
// @body    {title:"안녕", body:"좋다"}
exports.updatePost = function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let body = req.body.body;

  let query = `update lcp_post 
                set title = "${title}", 
                body = "${body}" 
                where id = ${id} `;

  let query2 = "update lcp_post set title = ? , body = ? where id = ?";
  connection.query(query2, [title, body, id], function (
    error,
    results,
    fields
  ) {
    console.log(results);
    res.status(200).json({ success: true });
  });
};

// @desc    메모 삭제하기
// @route   DELETE /api/v1/posts/:id
exports.deletePost = (req, res, next) => {
  let id = req.params.id;

  let query = `delete from lcp_post where id = ${id}`;

  connection.query(query, function (error, results, fields) {
    console.log(results);
    res.status(200).json({ success: true });
  });
};
