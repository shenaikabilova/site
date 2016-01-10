/**
 * Created by User on 29.12.2015 г..
 */
var mysql = require('mysql');

function loadUsers () {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'users'
    });
    connection.connect();

    connection.query('SELECT user_name,pass1,pass2,email,gender,b_day FROM users;', function (err, rows) {
        if (err) throw err;

        var body = document.getElementsByTagName("body")[0];
        var myTable = document.getElementById('myTable');

        var table = document.createElement('TABLE');
        table.border = '1';

        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);

        for(var j = 0; j < 6; j++) {
            var tr = document.createElement('TR');

            for (var i = 0; i < rows.length; i++) {
                var td = document.createElement('TD');

                td.appendChild(document.createTextNode(rows[i].user_name));
                td.appendChild(document.createTextNode(rows[i].pass1));
                td.appendChild(document.createTextNode(rows[i].pass2));
                td.appendChild(document.createTextNode(rows[i].email));
                td.appendChild(document.createTextNode(rows[i].gender));
                td.appendChild(document.createTextNode(rows[i].b_day));

                tr.appendChild(td);
            }
            tableBody.appendChild(tr);

        }
        myTable.appendChild(table);
        body.appendChild(myTable);
    });
}