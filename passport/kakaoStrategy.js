const KakaoStrategy = require('passport-kakao').Strategy;
const pool = require('../config/dbconfig');

module.exports = (passport) => {
    console.log(process.env.KAKAO_ID);
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURLL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        // try {
        //     pool.getConnection(function(err, conn){
        //         if (err) throw err;

        //         conn.require(`SELECT * FROM player WHERE sns_id='${profile.id}`)
            // if (exUser) {
            //     done(null, exUser);
            // } else {
            //     const newUser = await User.create({
            //         email: profile._json && profile._json.kaccount_email,
            //         nick: profile.dispalyName,
            //         snsId: profile.id,
            //         provider: 'kakao',
            //     });
            //     done(null, newUser);
            // }
        //     });
        // } catch (error) {
        //     console.error(error);
        //     done(error);
        // }
    }));
};