var express = require('express');
var mysql = require('mysql');
var router = express.Router();

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/userSettings', function(req, res, neext) {
  var conn = mysqlDB();
  conn.query('select user_name, pass1, email, gender, b_day from users where user_name = "' +  + '"', function(err, rows) {
        if (err) throw err;
        res.username.set(rows[0].user_name);
  })
});

module.exports = router;
