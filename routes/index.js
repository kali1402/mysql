var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'amcopeew48',
  database        : 'kali'
});

/* GET home page. */
router.get('/', function(req, res, next) {

  pool.getConnection(function(err, conn) {

    conn.query('SELECT * FROM emp;', function(err, results) {
      res.render('index', { results: results });

      conn.release();
    });
  });
});

module.exports = router;
