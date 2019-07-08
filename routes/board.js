var express = require('express');
var router = express.Router();
const pool = require('../config/dbconfig');

// 게시판 페이지 이동
router.get('/noticeboard', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`SELECT a.*, (SELECT COUNT(*) FROM comment WHERE board_id=a.id) AS 'count' FROM noticeboard AS a;`, function(err, results){
            res.render('board/noticeboard', {results: results});
        });
        conn.release();
    });
});

//게시판 글 쓰기 페이지 이동
router.get('/write', function(req, res, next) {
    pool.getConnection(function(err, conn){
      conn.query(`SELECT * FROM noticeboard WHERE NAME='${req.session.ID}';`, function(err, results){
            res.render('board/write', { results: results });
            conn.release();
        });
    });
});

//게시판 글 쓰기 저장
router.post('/write', function(req, res, next) {
    const title = req.body.title;
    const contents = req.body.contents;
    
    
    pool.getConnection(function(err, conn){
        conn.query(`INSERT INTO noticeboard (title, contents, emaiI) VALUES ('${title}','${contents}','${req.session.ID}');`, function(err, results){
            res.redirect('/board/noticeboard');
            conn.release();
        });
    });
});

//게시판 글 삭제
router.get('/delete', function(req, res, next) {
    if(req.query.emaiI == req.session.ID) {
        pool.getConnection(function(err, conn){
            conn.query(`DELETE FROM noticeboard WHERE id='${req.query.id}';`, function(err, results) {
                conn.query(`DELETE FROM comment WHERE board_id='${req.query.id}';`, function(err, results) {
                    res.redirect('/board/noticeboard');
                    conn.release();
                });
            });
        });
    } else {
        res.render('board/deerror');
    }
});

//게시판 글 수정 페이지 이동
router.get('/update', function(req, res, next) {
    pool.getConnection(function(err, conn){
        if(req.query.emaiI == req.session.ID) {
            pool.getConnection(function(err, conn){
                
                conn.query(`SELECT * FROM noticeboard WHERE id='${req.query.id}';`, function(err, results) {
                    conn.query(`SELECT * FROM comment WHERE board_id='${req.query.id}';`, function(err, board_results) {
                        res.render('board/update',{results: results, board_results: board_results});
                        conn.release();
                    });
                });
            });
        } else {
            res.render('board/uperror');
        }
    });
});

//게시판 글 수정하기
router.post('/update', function(req, res, next) {
    const id = req.body.id;
    const title = req.body.title;
    const contents = req.body.contents;
    
    pool.getConnection(function(err, conn){
        conn.query(`UPDATE noticeboard SET title='${title}', contents='${contents}' WHERE id='${id}';`, function(err, results){
            conn.query('SELECT * FROM noticeboard;', function(err, results){
                res.render('board/noticeboard', {results: results});
                conn.release();
            });
        });
    });
});

//게시판 제목 눌렀을때 상세페이지로 이동
router.get('/board', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`SELECT * FROM comment WHERE board_id='${req.query.id}';`, function(err, board_results){
            conn.query(`SELECT a.*,COUNT(b.email) AS 'count' FROM noticeboard AS a LEFT JOIN COMMENT AS b ON a.id=b.board_id WHERE a.id='${req.query.id}';`, function(err, results){
                const email = req.session.ID;
                res.render('board/board', {counter: board_results.length, results: results, board_results: board_results, email: email});
            });
        });
        conn.release();
    });
});

//게시판 상세페이지에서 댓글 다는 라우터
router.post('/comment', function(req, res, next) {
    const content = req.body.content;
    const board_id = req.body.id;
    pool.getConnection(function(err, conn){
        conn.query(`INSERT INTO comment(board_id, email, content)VALUES('${board_id}','${req.session.ID}','${content}');`, function(err, results){
            res.redirect(`/board/board?id=${board_id}`);
        });
        conn.release();
    });
});
module.exports = router;
