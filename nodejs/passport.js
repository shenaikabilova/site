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
        database: 'users'
    });
    connection.connect();

    return connection;
}

module.exports = function (passport) {
    var conn = mysqlDB();

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        conn.query("select * from users where id = "+id,function(err,rows){
            done(err, rows[0]);
        });
    });

    passport.use('local-registration', new LocalStrategy(function(req, username, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        conn.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {
                // if there is no user with that username
                // create the user
                var newUserMysql = {
                    username: username,
                    password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                };

                var insertQuery = "INSERT INTO users(user_name,pass,email,gender,b_day, role) VALUES(?,?,?,?,?,?)";

                conn.query(insertQuery,[newUserMysql.username, newUserMysql.password,
                newUserMysql.email, newUserMysql.gender, newUserMysql.bday, "user"],function(err, rows) {
                    newUserMysql.id = rows.insertId;

                    return done(null, newUserMysql);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy(function (username, password, done) {

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
}