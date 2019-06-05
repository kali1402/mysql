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
      const error = 0;
      res.render('login', {ERROR: error});
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

router.post('/login', function(req, res, next) {
  
  const id = req.body.id;
  const pw = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM player WHERE email = '${id}' AND pw = md5('${pw}');`,function(err, result){
      if(result.length > 0) {
        res.render('login2', {ID: id, PW: pw});
      }
    });
    conn.query(`SELECT * FROM player WHERE email = '${id}' OR pw = md5('${pw}');`,function(err, result){
      if(result.length >= 0) {
        const error = 100;
        res.render('login', {ERROR: error});
      }
    });
    conn.release();
  });
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
  req.session.destroy();
});

router.post('/Iogin', function(req, res, next) {
  const id = req.body.id;
  const pw = req.body.pw;
  if(id.length > 0 && pw.length > 0) {
    pool.getConnection(function(err, conn){
      conn.query('SELECT * FROM player;',function(err, results){
        res.render('index', { results : results});
        conn.release();
      });
    });
  } else {
    res.render('login');
  }
});

module.exports = router;