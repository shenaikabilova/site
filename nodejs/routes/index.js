var express = require('express');
var mysql = require('mysql');
var passport = require('passport');
var router = express.Router();

function mysqlDB() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'users',
    dateStrings: 'date'
  });
  connection.connect();

  return connection;
}

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

module.exports = function(app, passport) {
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    })

    app.get('/', function(req, res) {
       // res.render('index', { title: 'Express' });
        res.redirect('/index.html');
    });

    //noinspection JSUnresolvedFunction
    app.post('/login', passport.authenticate('local-login', {
                            failureRedirect: '/index.html',
                            failureFlash : true

    }), function(req, res) {
        console.log(req.user);
            if(req.user.role==='admin') {
                res.redirect('/adminPanelAddBook.html');
            }
            if(req.user.role === 'user') {
                //res.redirect('/userLog.html');

                var conn = mysqlDB();

                conn.query('SELECT book_id,book_name,book_author,book_year,book_genre,book_publisher,book_cover,book_description FROM books',
                    function(err, rows) {
                        if (err) throw err;

                        res.render('user', {title: req.user.user_name, rows: rows});
                    });
            }
    });

    //noinspection JSUnresolvedFunction
    app.post('/user', function(req, res) {
        var conn = mysqlDB();
        if(req.body.pass1 === req.body.pass2) {
            conn.query('INSERT INTO users(user_name,pass,email,gender,b_day, role) VALUES("' +
                req.body.userName + '", "' +
                req.body.pass1 + '", "' +
                req.body.email + '", "' +
                req.body.gender + '", "' +
                req.body.bDay + '", "user")', function (err) {
                if (err) throw err;
                else {
                    res.redirect('/index.html')
                }
            })
        }
    });

    //noinspection JSUnresolvedFunction
    app.post('/adminPanelAddBook', function(req, res) {
        var conn = mysqlDB();

        conn.query('INSERT INTO books(book_id,book_name,book_author,book_year,book_genre,book_publisher,book_cover,book_description) VALUES ("' +
            req.body.bookID + '", "' +
            req.body.bookName + '", "' +
            req.body.bookAuthor + '", ' +
            req.body.bookYear + ', "' +
            req.body.bookGenre + '", "' +
            req.body.bookPublisher + '", "' +
            req.body.bookCover + '", "' +
            req.body.bookDescription + '")',
            function (err) {
                if (err) throw err;
                else {
                    res.redirect('/adminPanelAddBook.html');
                }
        })
    });

    //noinspection JSUnresolvedFunction
    app.post('/adminPanelBooks',  function(req, res) {
        var conn = mysqlDB();

        conn.query('SELECT book_id,book_name,book_author,book_year,book_genre,book_publisher,book_cover,book_description FROM books',
            function(err, rows) {
                if(err) throw err;

                /*for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i]);
                };*/


                res.render('books', {title: 'Книги', rows: rows});
            });
    });

    //noinspection JSUnresolvedFunction
    app.post('/searchBook',  function(req, res) {
        var conn = mysqlDB();

        conn.query('SELECT book_id,book_name,book_author,book_year,book_genre,book_publisher,book_cover,book_description FROM books WHERE book_name = ?', req.body.enterNameOfBook,
            function(err, rows) {
                if(err) throw err;

               /* for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i]);
                };*/

                res.render('books', {title: 'Книги', rows: rows});
            });
    });

    //noinspection JSUnresolvedFunction
    app.post('/deleteBook', function(req, res) {
        var conn = mysqlDB();

        conn.query('DELETE FROM books WHERE book_id = ?', req.body.id, function(err, rows) {
            if(err) throw err;

            res.sendFile('/adminPanelBooks');
        });
    });

    //noinspection JSUnresolvedFunction
    app.post('/adminPanelUsers', function(req, res){
        var conn = mysqlDB();

        conn.query('SELECT user_name,pass,email,gender,b_day, role FROM users', function(err, rows) {
            if(err) throw err;

            res.render('users', {title: 'Потребители', rows: rows});
        });
    });

    //noinspection JSUnresolvedFunction
    app.get('/adminPanelSettings', function(req, res) {
        var conn = mysqlDB();

        conn.query('SELECT * FROM users WHERE user_name = ?', req.user.user_name, function (err, rows) {
            if(err) throw err;

            console.log(rows);
            res.render('adminPanelSettings', {rows:rows});
        });
    });

    //noinspection JSUnresolvedFunction
    app.post('/adminPanelSettingsUpdate', function(req, res) {
        var conn = mysqlDB();

        conn.query('UPDATE users SET user_name= ?, pass = ?, email = ?, gender = ?,b_day = ?',
                    [req.body.adminName, req.body.adminPass, req.body.adminEmail, req.body.adminGender, req.body.bDay],
                    function(err, rows) {
                        if(err) throw err;

                        res.sendfile('/adminPanelSettings');
                    });
    });

    //noinspection JSUnresolvedFunction
    app.post('/deleteUser', function(req, res) {
        var conn = mysqlDB();

        conn.query('DELETE a.*, b.* FROM users a left join userbooks b on a.user_name = b.user_name where a.user_name=?', [req.body.delUser], function(err, rows){
            if(err) throw err;

            res.redirect('/adminPanelUsers.html');
        });
    });

    app.get('/userSettings', function(req, res) {
        console.log("proba");

        var conn = mysqlDB();

        conn.query('SELECT * FROM users WHERE user_name = ?', req.user.user_name, function(err, rows) {
            if(err) throw err;

            console.log(rows);
            res.render('userSettings', {title: req.user.user_name, rows: rows});
        });
    });

    app.get('/user', function(req, res) {
        var conn = mysqlDB();

        conn.query('SELECT * FROM books', function (err, rows) {
            if(err) throw err;

            res.render('user', {rows: rows});
        });
    });

    //noinspection JSUnresolvedFunction
    app.post('/userSettingsUpdate', function(req, res) {
       var conn = mysqlDB();

        if(req.body.password === req.body.pass2) {
            conn.query('UPDATE users SET user_name= ?, pass = ?, email = ?, gender = ?,b_day = ? where user_name=?',
                [req.body.username, req.body.password, req.body.email, req.body.gender, req.body.bDay, req.user.user_name],
                function (err, rows) {
                    if (err) throw err;

                    res.render('userSettings', {rows: rows});
                });
        }
    });

    //noinspection JSUnresolvedFunction
    app.post('/userSettingsDelete', function(req, res) {
        var conn = mysqlDB();

        conn.query('DELETE a.*, b.* FROM users a left join userbooks b on a.user_name = b.user_name where a.user_name=?', [req.user.user_name], function(err, rows){
            if(err) throw err;

            console.log("end session " + req.user.user_name);
            req.logout();
            res.redirect('index.html');
        });
    });

    //noinspection JSUnresolvedFunction
    app.post('/addUserBook', function(req,res) {
        var conn = mysqlDB();

        conn.query("INSERT INTO userbooks(user_name,book_id) VALUES(?,?)", [req.user.user_name, req.body.bookISIN], function(err, rows) {
            if(err) throw err;

            console.log(rows);
            res.render('userBooks', {rows:rows});
        });
    });

    app.get('/userBooks', function(req, res) {
        var conn = mysqlDB();

        conn.query('SELECT books.book_id, books.book_name,books.book_author, books.book_year,books.book_genre,books.book_publisher,books.book_cover,books.book_description FROM userbooks inner join books on userbooks.book_id=books.book_id where user_name=?', [req.user.user_name],
            function(err, rows){
                if(err) throw err;

                console.log(rows);
                res.render('userBooks', {rows:rows});
        });
    });

    app.get('/logout', function(req, res) {
        console.log("end session " + req.user.user_name);
        req.logout();
        res.redirect('index.html');
    });
};
//
//
//noinspection JSUnresolvedFunction
/*router.post('/login', function(req, res) {
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
            if(role === 'admin') {
                res.redirect('/adminPanelAddBook.html');
            }
            else res.redirect('/userLog.html');
        }

    });
});*/

//noinspection JSUnresolvedFunction

/*router.post('/user', function(req, res) {
    var conn = mysqlDB();
    if(req.body.pass1 === req.body.pass2) {
        conn.query('INSERT INTO users(user_name,pass,email,gender,b_day, role) VALUES("' +
            req.body.userName + '", "' +
            req.body.pass + '", "' +
            req.body.email + '", "' +
            req.body.gender + '", "' +
            req.body.bDay + '", "user")', function (err) {
            if (err) throw err;
            else {
                res.redirect('/userLog.html')
            }
        })
    }
});*/

//module.exports = router;