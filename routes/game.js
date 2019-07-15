var express = require('express');
var router = express.Router();
const pool = require('../config/dbconfig');

// 게임 페이지 이동
router.get('/game', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`SELECT * FROM game WHERE player_id='${req.session.ID}';`, function(err, results) {
            if(results.length == 0) {
                conn.query(`INSERT INTO game(player_id, money) VALUES ('${req.session.ID}', '100000');`, function(err, results) {
                    res.render('game/game');
                });
            } else {
                res.render('game/game');
            }
        });
    });
});

router.get('/oddeven', function(req, res, next) {
    pool.getConnection(function(err, conn){
        conn.query(`SELECT * FROM game WHERE player_id='${req.session.ID}';`, function(err, results) {

            res.render('game/oddeven', {results: results, error: 0});
            conn.release();
        });
    });
});

router.post('/oddeven', function(req, res, next) {
    const oddeven = req.body.oddeven;

    pool.getConnection(function(err, conn){

        conn.query(`SELECT * FROM game WHERE player_id='${req.session.ID}';`, function(err, results) {
            
            if(results[0].money < req.body.money || req.body.money==0) {
                res.render('game/oddeven', {results: results, error: 100});
            } else if((req.body.odd == '' && req.body.even == '')) {
                res.render('game/oddeven', {results: results, error: 200});
            } else {
                
                if(oddeven[0] == req.body.odd || oddeven[0] == req.body.even) {

                    let money = req.body.money;
                    let money2 = req.body.money;
                    money = money * 5;
                    money2 = money2 * 5;
                    money = money + results[0].money;

                    conn.query(`UPDATE game SET money = ${money} WHERE player_id = '${req.session.ID}';`, function(err, results) {
                        res.render('game/oddeven1', {results: req.body, oddeven: oddeven, money: money2});
                    });
                }
            }
        });
    });
});

module.exports = router;
