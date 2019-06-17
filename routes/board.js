var express = require('express');
var router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'amcopeew48',
    database        : 'kali',
    dateStrings     : 'dete'
});

// 게시판 페이지 이동
router.get('/noticeboard', function(req, res, next) {
    pool.getConnection(function(err, conn){
      conn.query('SELECT * FROM noticeboard;', function(err, results){
            res.render('noticeboard', {results: results});
            conn.release();
        });
    });
});

//게시판 글 쓰기 페이지 이동
router.get('/write', function(req, res, next) {
    pool.getConnection(function(err, conn){
      conn.query(`SELECT * FROM noticeboard WHERE NAME='${req.session.ID}';`, function(err, results){
            res.render('write', { results: results });
            conn.release();
        });
    });
});

//게시판 글 쓰기 저장
router.post('/write', function(req, res, next) {
    const title = req.body.title;
    const contents = req.body.contents;
    const name = req.body.name;
    
    
    pool.getConnection(function(err, conn){
        conn.query(`INSERT INTO noticeboard (name, title, contents, email) VALUES ('${name}','${title}','${contents}','${req.session.ID}');`, function(err, results){
            res.redirect('/board/noticeboard');
            conn.release();
        });
    });
});

//게시판 내 글 보기 페이지 이동
router.get('/see', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`SELECT * FROM noticeboard WHERE email='${req.session.ID}';`, function(err, results){
            res.render('see', { results: results });
            conn.release();
        });
    });
});

//게시판 글 삭제
router.get('/delete', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`DELETE FROM noticeboard WHERE id='${req.query.id}'`, function(err, results){
            res.redirect('/board/noticeboard');
            conn.release();
        });
    });
});
module.exports = router;
