const sqlite3 = require("sqlite3").verbose();

exports.connect = function () {
    return new sqlite3.Database("./data/database.db", err => {
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
        }
    });

    db.run("create table if not exists delete_account_request\n" +
        "(\n" +
        "    acc_no integer      not null\n" +
        "        constraint delete_account_request_accounts_account_number_fk\n" +
        "            references accounts,\n" +
        "    reason varchar(100) not null,\n" +
        "    aadhaar_no varchar(20) not null\n" +
        ");", err => {
        if (err) {
            console.log(err.message);
        } else {

        }
    });

    db.run("create table if not exists balance\n" +
        "(\n" +
        "    acc_no  integer not null\n" +
        "        constraint balance_accounts_account_number_fk\n" +
        "            references accounts,\n" +
        "    balance double  not null\n" +
        ");,", err => {
        if (err) {
            console.log(err.message);
        } else {
        }
    });

    db.run("create table if not exists queries\n" +
        "(\n" +
        "    name    varchar(30)  not null,\n" +
        "    phone   long integer not null,\n" +
        "    acc_no  integer,\n" +
        "    title   varchar(50)  not null,\n" +
        "    message varchar(200) not null\n" +
        ");", err => {
        if (err) {
            console.log(err.message);
        } else {

        }
    });

    db.run("create table if not exists transactions\n" +
        "(\n" +
        "    sender_acc_no integer     not null,\n" +
        "    amount        double      not null,\n" +
        "    recipient     varchar(30) not null,\n" +
        "    date          date        not null,\n" +
        "    time          time        not null\n" +
        ");\n", err => {
        if (err) {
            console.log(err.message);
        } else {

        }
    });

    db.run("create table if not exists loan\n" +
        "(\n" +
        "    acc_no      integer      not null\n" +
        "        constraint loan_accounts_account_number_fk\n" +
        "            references accounts,\n" +
        "    loan_amount double       not null,\n" +
        "    loan_type   varchar(20)  not null,\n" +
        "    reason      varchar(100) not null\n" +
        ");", err => {
        if (err) {
            console.log(err.message);
        } else {

        }
    });
}