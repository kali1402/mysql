var express = require('express');
var router = express.Router();
const pool = require('../config/dbconfig');

// 게임 페이지 이동
router.get('/game', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`SELECT * FROM game WHERE id='${req.session.ID}';`, function(err, results) {
            
            
            res.render('game/game');
            conn.release();
        });
    });
});

router.post('/oddeven', function(req, res, next) {
    const oddeven = req.body.oddeven;
    
    res.render('game/oddeven', {oddeven: oddeven});
});

module.exports = router;
