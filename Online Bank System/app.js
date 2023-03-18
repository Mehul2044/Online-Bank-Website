require("dotenv").config();
const express = require("express");
const app = express();
const bodyParse = require("body-parser");
// const collection = require("./models/mongodb");
const relation = require("./models/sqlite");
require("async");
const port = process.env.PORT;
const projectName = "MyBank";

const db = relation.connect();
relation.createTables(db);

let isLogged = false;

app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static("assets"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    isLogged = false;
    res.render("home_page", {projectName: projectName});
});

app.get("/login", function (req, res) {
    res.render("login", {projectName: projectName});
});

app.get("/registration", function (req, res) {
    res.render("registration", {projectName: projectName});
});

app.get("/about", function (req, res) {
    res.render("about_us", {projectName: projectName});
});

app.get("/main", function (req, res) {
    if (isLogged) {
        res.render("main", {projectName: projectName})
    } else {
        res.redirect("/login")
    }
})

app.post("/login", async (req, res) => {
    let account_number = req.body.account_number;
    let password = req.body.password;
    await db.get("SELECT password FROM accounts WHERE account_number = ?", [account_number], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row) {
            let password_check;
            password_check = row.password
            if (password_check === password) {
                isLogged = true;
                res.redirect("/main")
            } else {
                res.send("Details do not match.");
            }
        } else {
            res.send("Details do not match");
        }
    });
})

app.post("/register", async (req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let eMail = req.body.eMail
    let password = req.body.password

    let exist;

    function checkAccountExists(eMail) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM accounts WHERE eMail = ?`, [eMail], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                exist = !!row;
                resolve(exist);
            });
        });
    }

    exist = await checkAccountExists(eMail);
    if (exist) {
        res.send("Account already exists.");
    } else if (!exist) {
        db.run("insert into accounts (fname, lname, email, password) values " +
            "('" + firstName + "','" + lastName + "','" + eMail + "','" + password + "')", err => {
            if (err) {
                console.log(err);
            } else {
                isLogged = true;
                res.redirect("/main");
            }
        });
    }
});

app.listen(port, function () {
    console.log("Server is running on port " + port + ".");
});