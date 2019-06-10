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

// 로그인 시작 페이지
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query('SELECT * FROM player;', function(err, results) {
      const error = 0;
      const success = 0;
      res.render('login', {ERROR: error, SUCCESS: success});
      conn.release();
    });
  });
});

// 회원정보 페이지
router.get('/index', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM player;',function(err, results){
      res.render('index', { results : results});
      conn.release();
    });
  });
});

// 로그인 했을경우 있는 아이디, 비밀번호인지 확인후 맞으면 로그인 확인 페이지로 이동 틀릴경우 로그인 페이지로 이동
router.post('/login', function(req, res, next) {
  
  const id = req.body.email;
  const pw = req.body.pw;
  
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM player WHERE email = '${id}' AND pw = md5('${pw}');`,function(err, result){
      if(result.length > 0) {
        res.render('login2', {id: id, pw: pw});
      }

      if(result.length >= 0) {
        const error = 100;
        const success = 0;
        res.render('login', {ERROR: error, SUCCESS: success});
      }
    });
    conn.release();
  });
});

// 로그아웃 페이지 이동
router.get('/logout', function(req, res, next) {
  res.render('logout');
  req.session.destroy();
});

// 회원가입 페이지 이동
router.get('/signup', function(req, res, next) {
  const error = 0;
  res.render('signup', {ERROR: error});
});

// 회원가입에서 적은 정보를 저장
router.post('/signup', function(req, res, next) {
  const name = req.body.name;
  const age = req.body.age;
  const gender = req.body.gender;
  const birth = req.body.birth;
  const hobby = req.body.hobby;
  const phone = req.body.phone;
  const email = req.body.email;
  const pw = req.body.pw;
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM player WHERE email = '${email}'`,function(err, result){
      if(result.length > 0) {
        const error = 100;
        res.render('signup', {ERROR: error});
      } else {
        conn.query(`INSERT INTO player(name, age, gender, birth, hobby, phone, email, pw)VALUES('${name}', '${age}', '${gender}', '${birth}', '${hobby}', '${phone}', '${email}', MD5('${pw}'));`,function(err, result){
          // conn.query(`SELECT * FROM player WHERE name = '${name}' AND age = '${age}' AND gender = '${gender}' AND birth = '${birth}' AND hobby = '${hobby}' AND phone = '${phone}' AND email = '${email}' AND pw = MD5('${pw}');`,function(err, result){
          const error = 0;
          const success = 100;
          res.render('login', {ERROR: error, SUCCESS: success});
        });
      }
    });
  });
});

// 로그인 상태에서 로그인을 눌렀을시 회원정보 페이지로 이동
router.post('/Iogin', function(req, res, next) {
  const id = req.body.id;
  const pw = req.body.id;
  if(id.length > 0 && pw.length > 0) {
    pool.getConnection(function(err, conn){
      conn.query('SELECT * FROM player;',function(err, results){
        res.render('index', { results : results});
        conn.release();
      });
    });
  } else {
    const error = 0;
    const success = 0;
    res.render('login', {ERROR: error, SUCCESS: success});
  }
});

module.exports = router;