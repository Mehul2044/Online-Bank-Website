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

let account_number;
let fName;
let lastName;
let eMail;

app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static("assets"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    isLogged = false;
    res.render("home_page", {projectName: projectName});
});

app.get("/login", function (req, res) {
    isLogged = false;
    res.render("login", {projectName: projectName});
});

app.get("/registration", function (req, res) {
    isLogged = false;
    res.render("registration", {projectName: projectName});
});

app.get("/about", function (req, res) {
    res.render("about_us", {projectName: projectName, isLogged: isLogged, fName: fName});
});

app.get("/terms_conditions", function (req, res) {
    res.render("terms_conditions", {projectName: projectName, isLogged: isLogged, fName: fName, req: req});
});

app.get("/contact_us", function (req, res) {
    res.render("contact_us", {projectName: projectName, isLogged: isLogged, fName: fName});
});

app.get("/main", function (req, res) {
    if (isLogged) {
        res.render("main", {projectName: projectName, fName: fName});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/transfer", function (req, res) {
    if (isLogged) {
        res.render("transfer", {projectName: projectName, fName: fName});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/view_profile", function (req, res) {
    if (isLogged) {
        res.render("view_profile", {projectName: projectName, fName: fName, lName: lastName, eMail: eMail});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/update_profile", function (req, res) {
    if (isLogged) {
        res.render("update_profile", {projectName: projectName, fName: fName, lName: lastName, eMail: eMail});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/loan", function (req, res) {
    if (isLogged) {
        res.render("loan", {projectName: projectName, fName: fName});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/loan/apply_loan", function (req, res) {
    if (isLogged) {
        res.render("apply_loan", {projectName: projectName, fName: fName});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/delete_account", function (req, res) {
    if (isLogged) {
        res.render("delete_account", {projectName: projectName, fName: fName});
    } else {
        res.redirect("/login");
    }
});

app.post("/login", async (req, res) => {
    account_number = req.body.account_number;
    let password = req.body.password;
    await db.get("SELECT * FROM accounts WHERE account_number = ?", [account_number], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row) {
            let password_check;
            password_check = row.password
            if (password_check === password) {
                isLogged = true;
                fName = row.fname;
                lastName = row.lname;
                eMail = row.email;
                res.redirect("/main")
            } else {
                res.send("Details do not match.");
            }
        } else {
            res.send("Details do not match.");
        }
    });
});

app.post("/registration", async (req, res) => {
    fName = req.body.firstName
    lastName = req.body.lastName
    eMail = req.body.eMail
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
            "('" + fName + "','" + lastName + "','" + eMail + "','" + password + "')", async err => {
            if (err) {
                console.log(err);
            } else {
                isLogged = true;
                db.get("select * from accounts where rowid = last_insert_rowid();", (err, row) => {
                    if (err) {
                        console.log(err);
                    } else {
                        fName = row.fname;
                        eMail = row.email;
                        account_number = row.account_number;
                        db.run("insert into balance values(?, ?);", [account_number, 0], err => {
                            if (err) {
                                console.log(err.message);
                            } else {
                                res.redirect("/main");
                            }
                        });
                    }
                });
            }
        });
    }
});

app.post("/main/update_profile", function (req, res) {
    let first = req.body.firstName;
    let last = req.body.lastName;
    let mail = req.body.email;
    if (!first) {
        first = fName;
    }
    if (!last) {
        last = lastName;
    }
    if (!mail) {
        mail = eMail;
    }
    db.run("update accounts set fname = ?, lname = ?, email = ? where account_number = ?", [first, last, mail, account_number], err => {
        if (err) {
            console.log(err);
        } else {
            fName = first;
            lastName = last;
            eMail = mail;
            res.redirect("/main");
        }
    });
});

app.post("/main/transfer", async (req, res) => {
    let sender_account = account_number;
    console.log(req.body);
    let recipient_acc_no = req.body.recipient_acc_no;
    let amount = Number(req.body.amount);
    let sender_balance = 0;
    await db.get("select * from balance where acc_no = ?", [sender_account], (err, row) => {
        if (err) {
            console.log(err.message);
        } else {
            sender_balance = row.balance;
            console.log(sender_balance);
            if (sender_balance < amount) {
                res.send("Balance insufficient!");
            } else {
                db.run("update balance set balance = balance + ? where acc_no = ?", [amount, recipient_acc_no], err => {
                    if (err) {
                        console.log(err.message);
                    }
                });
                db.run("update balance set balance = balance - ? where acc_no = ?", [amount, sender_account], err => {
                    if (err) {
                        console.log(err.message);
                    }
                });
                db.run("insert into transactions values(?, ?, ?);", [sender_account, amount, recipient_acc_no], err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Transaction Successful");
                        res.redirect("/main");
                    }
                });
            }
        }
    });
});

app.post("/main/delete_account", function (req, res) {
    db.run("insert into delete_account_request values(?, ?, ?);", [account_number, req.body.reason, req.body.aadhar], (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Deletion request sent.");
            res.redirect("/main");
        }
    });
});

app.post("/contact_us", function (req, res) {
    let message = req.body.message;
    let name = req.body.name;
    let ph_no = req.body.ph_no;
    let acc_no = req.body.acc_no;
    let title = req.body.title;
    if (!acc_no) {
        db.run("insert into queries (name, phone, title, message) values(?, ?, ?, ?);", [name, ph_no, title, message], err => {
            if (err) {
                console.log(err.message);
            } else {
                res.redirect("/main");
            }
        });
    } else {
        db.run("insert into queries values(?, ?, ?, ?, ?);", [name, ph_no, acc_no, title, message], err => {
            if (err) {
                console.log(err.message);
            } else {
                res.redirect("/main");
            }
        });
    }
});

app.post("/main/loan/apply_loan", function (req, res) {
    let loan_amount = req.body.amount;
    let loan_type = req.body.loan_type;
    let reason = req.body.reason;
    db.run("insert into loan values(?, ?, ?, ?);", [account_number, loan_amount, loan_type, reason], err => {
        if (err) {
            console.log(err.message);
        } else {
            res.redirect("/main");
        }
    });
});

app.listen(port, function () {
    console.log("Server is running on port " + port + ".");
});