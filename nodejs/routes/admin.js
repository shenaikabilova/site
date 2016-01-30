/**
 * Created by User on 28.12.2015 г..
 */
var express = require('express');
var mysql = require('mysql');
var router = express.Router();

function mysqlDB() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'books'
    });
    connection.connect();

    return connection;
}

//noinspection JSUnresolvedFunction
/*router.post('/adminPanelAddBook', function(req, res) {
    console.log("example");
    var conn = mysqlDB();
    conn.query('INSERT INTO books(book_id,book_name,book_author,book_year,book_genre,book_publisher,book_cover,book_description) VALUES (' +
        req.body.bookID + ', "' +
        req.body.bookName + '", "' +
        req.body.bookAuthor + '", ' +
        req.body.bookYear + ', "' +
        req.body.bookGenre + '", "' +
        req.body.bookPublisher + '", "' +
        req.body.bookCover + '", "' +
        req.body.bookDescription + '")', function (err) {
            if (err) throw err;
            else {
                res.redirect('/adminPanelBooks.html');
            }
        })
});*/

module.exports = router;