var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//
//
//noinspection JSUnresolvedFunction
router.post('/login', function(req, res) {
  var userName = req.body.username;
  var pass = req.body.password;
    var conn = mysqlDB();

    var pass1 = '';
    var e_mail = '';
    var gender = '';
    var b_day = '';
    var role = '';
    conn.query('SELECT * FROM users WHERE user_name = "' + userName + '"', function (err, rows) {
        if(err) throw err;
        pass1 = rows[0].pass;
        e_mail = rows[0].e_mail;
        gender = rows[0].gender;
        b_day = rows[0].b_day;
        role = rows[0].role;

        if(pass1 === pass) {
            localStorage.setItem('username', userName);
            if(role === 'admin') {
                res.redirect('/adminPanelAddBook.html');
            }
            else res.redirect('/user.html');
        }

    });
});

//noinspection JSUnresolvedFunction
router.post('/user', function(req, res) {
  var conn = mysqlDB();
    if(req.body.pass1 === req.body.pass2) {
        conn.query('INSERT INTO users(user_name,pass,email,gender,b_day) VALUES("' +
            req.body.userName + '", "' +
            req.body.pass1 + '", "' +
            req.body.email + '", "' +
            req.body.gender + '", "' +
            req.body.bDay + '")', function (err) {
            if (err) throw err;
            else {
                res.redirect('/user.html')
            }
        })
    }
});

module.exports = router;