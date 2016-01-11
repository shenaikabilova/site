/**
 * Created by User on 11.1.2016 г..
 */
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');

function mysqlDB() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'site'
    });
    connection.connect();

    return connection;
}

module.exports = function (passport) {
    var conn = mysqlDB();

    passport.use(new LocalStrategy(function (username, password, done) {

            conn.query('SELECT * FROM users WHERE user_name = "' + username + '"', function (err, rows) {
                if (err) done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found!'));
                }
                if (!(rows[0].pass == password)) {
                    return done(null, false, req.flash('loginMessage', 'Wrong password!'));
                }

                console.log(req.body);
                return done(null, rows[0]);
            })
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        conn.query("select * from users where id = "+id,function(err,rows){
            done(err, rows[0]);
        });
    });
}