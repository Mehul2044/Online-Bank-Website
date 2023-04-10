require("dotenv").config();
const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const collection = require("./models/mongodb");

const {accountCollection} = require("./models/mongodb")
const {balanceCollection} = require("./models/mongodb")
const {transactionCollection} = require("./models/mongodb")
const {deleteAccountCollection} = require("./models/mongodb")
const {queriesCollection} = require("./models/mongodb")
const {loanRequestCollection} = require("./models/mongodb")

const date = require("./custom_node_modules/date");

const port = process.env.PORT;
const projectName = "MyBank";

let isLogged = false;

let password;
let account_number;
let firstName;
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
    res.render("about_us", {projectName: projectName, isLogged: isLogged, fName: firstName, eMail: eMail});
});

app.get("/terms_conditions", function (req, res) {
    res.render("terms_conditions", {
        projectName: projectName,
        isLogged: isLogged,
        fName: firstName,
        req: req,
        eMail: eMail
    });
});

app.get("/contact_us", function (req, res) {
    res.render("contact_us", {projectName: projectName, isLogged: isLogged, fName: firstName, eMail: eMail});
});

app.get("/main", async function (req, res) {
    if (isLogged) {
        let dateString = date.getDate();
        try {
            const balanceDoc = await balanceCollection.findOne({accountNumber: account_number});
            const balance = balanceDoc.balance;
            const transactions = await transactionCollection.find({
                $or: [{sender_acc_no: account_number}, {recipient: account_number}],
            });
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                if (account_number === transactions[i].sender_acc_no.toString()) {
                    amount.push("-" + transactions[i].amount.toString());
                    to_from.push(transactions[i].recipient.toString());
                } else if (account_number === transactions[i].recipient) {
                    amount.push("+" + transactions[i].amount.toString());
                    to_from.push(transactions[i].sender_acc_no.toString());
                }
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            res.render("main", {
                projectName: projectName,
                fName: firstName,
                dates: dateString,
                lName: lastName,
                acc_no: account_number,
                balance: balance,
                transactions_length: transactions_length,
                amount: amount,
                to_from: to_from,
                date: date,
                time: time,
                eMail: eMail
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect("/login");
    }
});

app.get("/main/transfer", function (req, res) {
    if (isLogged) {
        res.render("transfer", {projectName: projectName, fName: firstName, eMail: eMail});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/view_profile", function (req, res) {
    if (isLogged) {
        res.render("view_profile", {projectName: projectName, fName: firstName, lName: lastName, eMail: eMail});
    } else {
        res.redirect("/login");
    }
});

app.get("/main/loan", function (req, res) {
    if (isLogged) {
        res.render("loan", {projectName: projectName, fName: firstName, eMail: eMail});
    } else {
        res.redirect("/login");
    }
});

app.post("/login", async (req, res) => {
    account_number = req.body.account_number;
    password = req.body.password;
    const user = await accountCollection.findOne({
        _id: account_number
    })
    if (!user) {
        res.send("Account does not exist")
    } else {
        if (password === user.password) {
            isLogged = true;
            firstName = user.firstName;
            lastName = user.lastName;
            eMail = user.eMail;
            res.redirect("/main")
        } else {
            res.send("Details do not match")
        }
    }
});

app.post("/registration", async (req, res) => {
    // firstName = req.body.firstName
    // lastName = req.body.lastName
    // eMail = req.body.eMail
    // let password = req.body.password
    // let exist;
    //
    // function checkAccountExists(eMail) {
    //     return new Promise((resolve, reject) => {
    //         db.get(`SELECT * FROM accounts WHERE eMail = ?`, [eMail], (err, row) => {
    //             if (err) {
    //                 console.error(err.message);
    //                 reject(err);
    //             }
    //             exist = !!row;
    //             resolve(exist);
    //         });
    //     });
    // }
    //
    // exist = await checkAccountExists(eMail);
    // if (exist) {
    //     res.send("Account already exists.");
    // } else if (!exist) {
    //     db.run("insert into accounts (fname, lname, email, password) values " +
    //         "('" + fName + "','" + lastName + "','" + eMail + "','" + password + "')", async err => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             isLogged = true;
    //             db.get("select * from accounts where rowid = last_insert_rowid();", (err, row) => {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     fName = row.fname;
    //                     eMail = row.email;
    //                     account_number = row.account_number;
    //                     db.run("insert into balance values(?, ?);", [account_number, 0], err => {
    //                         if (err) {
    //                             console.log(err.message);
    //                         } else {
    //                             res.redirect("/main");
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // }
});

app.post("/main/update_email", function (req, res) {
    let mail = req.body.email;
    if (!mail) {
        mail = eMail;
    }
    accountCollection.updateOne(
        {_id: account_number}, {eMail: mail})
        .then(function () {
            eMail = mail;
            res.redirect("/main")
        })
        .catch(err => console.log(err.message));
});

app.post("/main/update_password", function (req, res) {
    let oldP = req.body.old;
    let newP = req.body.new;
    if (oldP === password) {
        accountCollection.updateOne(
            {_id: account_number}, {password: newP})
            .then(function () {
                password = newP;
                res.redirect("/main")
            })
            .catch(err => console.log(err.message));
    } else {
        res.send("Enter old password correctly.")
    }
});

app.post("/main/transfer", async (req, res) => {
    let sender_account = account_number;
    let recipient_acc_no = req.body.recipient_acc_no;
    let amount = Number(req.body.amount);

    balanceCollection.findOne({accountNumber: sender_account})
        .then(sender_balance_doc => {
            let sender_balance = sender_balance_doc.balance;
            if (sender_balance < amount) {
                res.send("Balance insufficient!");
            } else {
                balanceCollection.updateOne(
                    {accountNumber: recipient_acc_no}, {$inc: {balance: amount}},).catch(err => console.log(err.message));
                balanceCollection.updateOne(
                    {accountNumber: sender_account}, {$inc: {balance: -amount}},).catch(err => console.log(err.message));
                transactionCollection.create({
                    sender_acc_no: sender_account,
                    amount: amount,
                    recipient: recipient_acc_no,
                    date: new Date().toLocaleString().slice(0, 9).replace('T', ' '),
                    time: new Date().toLocaleString().slice(11, 19).replace('T', ' ')
                },).catch(err => console.log(err.message));
            }
        })
        .then(() => res.redirect("/main"))
        .catch(err => console.log(err.message));
});

app.post("/main/delete_account", function (req, res) {
    deleteAccountCollection.create({
        accountNumber: account_number, reason: req.body.reason, aadhar: req.body.aadhar
    }).then(function () {
        console.log("Deletion request sent.");
        res.redirect("/main");
    }).catch(err => console.log(err.message));
});

app.post("/contact_us", function (req, res) {
    let message = req.body.message;
    let ph_no = req.body.ph_no;
    let title = req.body.title;
    if (!isLogged) {
        queriesCollection.create({
            name: firstName + " " + lastName,
            phone: Number(ph_no),
            acc_no: null,
            title: title,
            message: message
        }).then(() => res.redirect("/main")).catch(err => console.log(err.message));
    } else {
        queriesCollection.create({
            name: firstName + " " + lastName,
            phone: Number(ph_no),
            acc_no: account_number,
            title: title,
            message: message
        }).then(() => res.redirect("/main")).catch(err => console.log(err.message));
    }
});

app.post("/main/loan/apply_loan", function (req, res) {
    let loan_amount = req.body.amount;
    let loan_type = req.body.loan_type;
    let reason = req.body.reason;

    loanRequestCollection.create({
        acc_no: account_number,
        loan_amount: loan_amount,
        loan_type: loan_type,
        reason: reason
    }).then(() => res.redirect("/main")).catch(err => console.log(err.message));
});

app.listen(port, function () {
    console.log("Server is running on port " + port + ".");
    collection.connect();
});