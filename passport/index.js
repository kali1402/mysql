const kakao = require('./kakaoStrategy');
const pool = require('../config/dbconfig');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {

        pool.getConnection(function(err, connection) {
            if (err) throw err;
            
            connection.query(`SELECT * FROM player WHERE id='${user}'`, function (error, results, fields){               
                                
                done(null, results);

                connection.release();
                if (error) throw error;

            })
        });        
    });
    kakao(passport);
}