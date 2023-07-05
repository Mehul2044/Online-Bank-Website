const  { Router } = require("express")
const router = Router()
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({dest: "uploaded_forms/"});

multer.diskStorage({
    function(req, file, cb) {
        cb(null, 'uploaded_forms/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const dir = path.join("uploaded_forms");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const {accountCollection} = require("../models/mongodb")
const {balanceCollection} = require("../models/mongodb")
const {transactionCollection} = require("../models/mongodb")
const {deleteAccountCollection} = require("../models/mongodb")
const {queriesCollection} = require("../models/mongodb")
const {loanRequestCollection} = require("../models/mongodb")
const {accountOpenRequests} = require("../models/mongodb")

const dateString = require("../custom_node_modules/date");
const projectName = "MyBank";

let isLogged = false;

let password;
let account_number;
let firstName;
let lastName;
let eMail;



router.get("/", function (req, res) {
    isAdminLogged = false;
    isLogged = false;
    res.render("home_page", {projectName: projectName});
});

router.get("/login-user", function (req, res) {
    isLogged = false;
    res.render("login_user", {projectName: projectName});
});

router.get("/registration", function (req, res) {
    isLogged = false;
    res.render("registration", {projectName: projectName});
});

router.get("/about", function (req, res) {
    res.render("about_us", {projectName: projectName, isLogged: isLogged, fName: firstName, eMail: eMail});
});

router.get("/terms_conditions", function (req, res) {
    res.render("terms_conditions", {
        projectName: projectName,
        isLogged: isLogged,
        fName: firstName,
        req: req,
        eMail: eMail
    });
});

router.get("/contact_us", function (req, res) {
    res.render("contact_us", {projectName: projectName, isLogged: isLogged, fName: firstName, eMail: eMail});
});

router.get("/main", async function (req, res) {
    if (isLogged) {
        let date_string = dateString.getDate();
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
                dates: date_string,
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
        res.redirect("/");
    }
});

router.get("/main/transfer", function (req, res) {
    if (isLogged) {
        res.render("transfer", {projectName: projectName, fName: firstName, eMail: eMail});
    } else {
        res.redirect("/");
    }
});

router.get("/main/view_profile", function (req, res) {
    if (isLogged) {
        res.render("view_profile", {projectName: projectName, fName: firstName, lName: lastName, eMail: eMail});
    } else {
        res.redirect("/");
    }
});

router.get("/main/loan", async function (req, res) {
    if (isLogged) {
        let amount = [];
        let status = [];
        let loan_type = [];
        const loans = await loanRequestCollection.find({
            acc_no: account_number
        });
        let loan_length = loans.length;
        for (let i = 0; i < loan_length; i++) {
            amount.push(loans[i].loan_amount.toString());
            status.push(loans[i].status.toString());
            loan_type.push(loans[i].loan_type.toString());
        }
        res.render("loan", {
            projectName: projectName,
            fName: firstName,
            eMail: eMail,
            loan_length: loan_length, loan_type: loan_type, amount: amount, loan_status: status
        });
    } else {
        res.redirect("/");
    }
});

router.post("/login-user", async (req, res) => {
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
            res.send("Details do not match");
        }
    }
});

router.post("/registration", upload.single("file"), (req, res) => {
    const file = req.file;
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.eMail;
    if (file == null) {
        console.log("Error");
        res.redirect("/registration");
        return;
    }
    console.log("File Uploaded Successfully.");
    const newRequest = new accountOpenRequests({
        first_name: fName,
        last_name: lName,
        email: email,
        formPath: file.filename,
        status: "Pending",
        password: "NewAccount@123",
    });
    newRequest.save().then(() => res.redirect("/")).catch(err => console.log(err.message));
});

router.post("/main/update_email", function (req, res) {
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

router.post("/main/update_password", function (req, res) {
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

router.post("/main/transfer", async (req, res) => {
    let sender_account = account_number;
    let recipient_acc_no = req.body.recipient_acc_no;
    let passwd = req.body.passwd;
    if (passwd === password) {
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
    } else {
        res.send("Incorrect password");
    }
});

router.post("/main/delete_account", function (req, res) {
    deleteAccountCollection.create({
        accountNumber: account_number, reason: req.body.reason, aadhar: req.body.aadhar
    }).then(function () {
        console.log("Deletion request sent.");
        res.redirect("/main");
    }).catch(err => console.log(err.message));
});

router.post("/contact_us", function (req, res) {
    let message = req.body.message;
    let ph_no = req.body.ph_no;
    let title = req.body.title;
    if (!isLogged) {
        queriesCollection.create({
            name: firstName + " " + lastName,
            phone: Number(ph_no),
            acc_no: null,
            title: title,
            message: message,
            status: "Pending"
        }).then(() => res.redirect("/main")).catch(err => console.log(err.message));
    } else {
        queriesCollection.create({
            name: firstName + " " + lastName,
            phone: Number(ph_no),
            acc_no: account_number,
            title: title,
            message: message,
            status: "Pending"
        }).then(() => res.redirect("/main")).catch(err => console.log(err.message));
    }
});

router.post("/main/loan/apply_loan", function (req, res) {
    let loan_amount = req.body.amount;
    let loan_type = req.body.loan_type;
    let reason = req.body.reason;

    loanRequestCollection.create({
        acc_no: account_number,
        loan_amount: loan_amount,
        loan_type: loan_type,
        reason: reason,
        status: "Pending"
    }).then(() => res.redirect("/main")).catch(err => console.log(err.message));
});

module.exports = router;