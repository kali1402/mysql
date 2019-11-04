var express = require("express");
var router = express.Router();
const pool = require("../config/dbconfig");

// 게임 페이지 이동
router.get("/game", function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query(
      `SELECT * FROM game WHERE player_id='${req.session.ID}';`,
      function(err, results) {
        if (results.length == 0) {
          conn.query(
            `INSERT INTO game(player_id, money) VALUES ('${req.session.ID}', '100000');`,
            function(err, results) {
              res.render("game/game");
            }
          );
        } else {
          res.render("game/game");
        }
      }
    );
  });
});

// 던전1 공격하기
router.get("/attack", function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query(`SELECT * FROM monster WHERE id = '1';`, function(err, monster) {
      console.log(monster[0].hp);
      conn.query(
        `SELECT * FROM rpggame WHERE player_id='${req.session.ID}';`,
        function(err, results) {
          res.render("game/dungeon1");
        }
      );
    });
  });
});

// 인벤토리 페이지 이동
router.get("/item", function(req, res, next) {
  res.render("game/item");
});

// 스킬 페이지 이동
router.get("/skill", function(req, res, next) {
  res.render("game/skill");
});

// 스텟 페이지 이동
router.get("/stat", function(req, res, next) {
  res.render("game/stat");
});

// 상점 페이지 이동
router.get("/shop", function(req, res, next) {
  res.render("game/shop");
});

// 던전 페이지 이동
router.get("/dungeon", function(req, res, next) {
  res.render("game/dungeon");
});

// 던전1 페이지 이동
router.get("/dungeon1", function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query(`SELECT * FROM monster WHERE name='슬라임';`, function(
      err,
      monster
    ) {
      conn.query(
        `SELECT * FROM rpggame WHERE player_id='${req.session.ID}';`,
        function(err, results) {
          res.render("game/dungeon1", { monster: monster, results: results });
        }
      );
    });
  });
});

// RPG게임 페이지 이동
router.get("/RPGgame", function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query(
      `SELECT tutorial FROM rpggame WHERE player_id='${req.session.ID}';`,
      function(err, results) {
        if (results.length == 0) {
          conn.query(
            `INSERT INTO rpggame(player_id, tutorial) VALUES ('${req.session.ID}', '1');`,
            function(err, results) {
              res.render("game/tutorial");
            }
          );
        } else if (results[0].tutorial == 1) {
          res.render("game/tutorial");
        } else {
          conn.query(
            `SELECT * FROM rpggame WHERE player_id='${req.session.ID}';`,
            function(err, results) {
              res.render("game/rpggame", { results: results });
            }
          );
        }
      }
    );
    conn.release();
  });
});

// 캐릭터 생성
router.post("/tutorial", function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query(
      `SELECT * FROM rpggame WHERE player_id='${req.session.ID}';`,
      function(err, results) {
        if (results[0].tutorial == 1) {
          conn.query(
            `UPDATE rpggame SET lv = 1 , nickname = '${req.body.name}', money = 1000, hp = 100, hpmax = 100, mp = 100, mpmax = 100, ad = 3, tutorial = 0 WHERE player_id='${req.session.ID}';`,
            function(err, results) {
              conn.query(
                `SELECT * FROM rpggame WHERE player_id='${req.session.ID}';`,
                function(err, results) {
                  res.render("game/rpggame", { results: results });
                }
              );
            }
          );
        } else {
          conn.query(
            `SELECT * FROM rpggame WHERE player_id='${req.session.ID}';`,
            function(err, results) {
              res.render("game/rpggame", { results: results });
            }
          );
        }
      }
    );
  });
});

// 홀짝 페이지 이동
router.get("/oddeven", function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query(
      `SELECT * FROM game WHERE player_id='${req.session.ID}';`,
      function(err, results) {
        res.render("game/oddeven", { results: results, error: 0 });
        conn.release();
      }
    );
  });
});

// 홀짝 게임 내용 결과 페이지 이동
router.post("/oddeven", function(req, res, next) {
  const oddeven = req.body.oddeven;

  pool.getConnection(function(err, conn) {
    conn.query(
      `SELECT * FROM game WHERE player_id='${req.session.ID}';`,
      function(err, results) {
        if (results[0].money < req.body.money || req.body.money == 0) {
          res.render("game/oddeven", { results: results, error: 100 });
        } else if (req.body.odd == "" && req.body.even == "") {
          res.render("game/oddeven", { results: results, error: 200 });
        } else {
          let money = req.body.money;
          money = results[0].money - money;
          const oddeven1 = req.body.even + req.body.odd;

          conn.query(
            `UPDATE game SET money = ${money} WHERE player_id = '${req.session.ID}';`
          );
          conn.query(
            `SELECT * FROM game WHERE player_id='${req.session.ID}';`,
            function(err, results) {
              if (oddeven[0] == req.body.odd || oddeven[0] == req.body.even) {
                let money = req.body.money;
                let money2 = req.body.money;
                money = money * 4;
                money2 = money2 * 4;
                money = money + results[0].money;
                conn.query(
                  `UPDATE game SET money = ${money} WHERE player_id = '${req.session.ID}';`,
                  function(err, results) {
                    res.render("game/oddeven1", {
                      results: req.body,
                      oddeven: oddeven,
                      money: money2
                    });
                  }
                );
              } else if (
                (oddeven1 % 2 == 0 && oddeven[0] % 2 == 0) ||
                (oddeven1 % 2 == 1 && oddeven[0] % 2 == 1)
              ) {
                let money = req.body.money;
                let money2 = req.body.money;
                money = money * 2;
                money2 = money2 * 2;
                money = money + results[0].money;

                conn.query(
                  `UPDATE game SET money = ${money} WHERE player_id = '${req.session.ID}';`,
                  function(err, results) {
                    res.render("game/oddeven1", {
                      results: req.body,
                      oddeven: oddeven,
                      money: money2
                    });
                  }
                );
              } else {
                let money2 = 0;
                conn.query(
                  `UPDATE game SET money = ${results[0].money} WHERE player_id = '${req.session.ID}';`,
                  function(err, results) {
                    res.render("game/oddeven1", {
                      results: req.body,
                      oddeven: oddeven,
                      money: money2
                    });
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

module.exports = router;
