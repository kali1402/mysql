const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'amcopeew48',
    database        : 'kali',
    dateStrings     : 'dete'
});

module.exports = pool;