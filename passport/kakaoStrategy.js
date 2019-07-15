const KakaoStrategy = require('passport-kakao').Strategy;
const pool = require('../config/dbconfig');
module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (cacessToken, refreshToken, profile, done) => {
        try {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(`SELECT id FROM player WHERE sns_id='${profile.id}' and provider='kakao'`, function (error, results, fields) {                
                    if (results.length > 0) {
                        done(null, results[0].id);
                    } else {
                        connection.query(`INSERT INTO player (id,name,sns_id,provider) VALUES ('${profile._json && profile._json.kaccount_email}','${profile.displayName}','${profile.id}','kakao');`, function (error, results, fields) {
                            if(results.affectedRows > 0){
                                connection.query(`SELECT id FROM player WHERE sns_id='${profile.id}' and provider='kakao'`,function(error, results, fields) {                                                            
                                    done(null, results[0].id);                                
                                })
                            }
                        });
                    }
                    connection.release();
                    if (error) throw error;
                });
            });
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};