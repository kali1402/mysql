var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express;

const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'amcopeew48',
  database        : 'kali',
  dateStrings     : 'dete'
});

router.get('/', function(req, res, next) {

  pool.getConnection(function(err, conn) {

    conn.query('SELECT * FROM player;', function(err, results) {
      res.render('login');
      conn.release();
    });
  });
});

router.post('/login', function(req, res, next) {
  const id = req.body.id;
  const pw = req.body.pw;
  console.log(`아이디 : ${id}\n비밀번호 : ${pw}`);
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM player WHERE email = '${id}';`,function(err, result){
      
      if(result.length > 0) {
        console.log('등록된 ID');
        res.render('login2', {ID: id, PW: pw});
      } else {
        console.log('미등록된 ID');
        res.render('login');
      }
      conn.release();
    });
  });
});

router.get('/index', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM player;',function(err, results){
      res.render('index', { results : results});

      conn.release();
    });
  });
});

module.exports = router;
