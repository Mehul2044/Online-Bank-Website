const sqlite3 = require("sqlite3").verbose();

exports.connect = function () {
    return new sqlite3.Database(__dirname + "/data/database.db", err => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Database connected");
        }
    });
}

exports.createTables = function (db) {
    db.run("create table if not exists accounts(fname varchar(30), lname varchar(30), email varchar(30), account_number INTEGER PRIMARY KEY AUTOINCREMENT, password varchar(30))", err => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Table created");
        }
    });
}