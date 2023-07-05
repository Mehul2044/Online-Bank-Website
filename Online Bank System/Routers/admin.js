const {Router} = require("express")
const fs = require("fs");
const router = Router();

let isAdminLogged = false;
let adminName;
const projectName = "MyBank";

const dateString = require("../custom_node_modules/date");

const {accountCollection} = require("../models/mongodb")
const {balanceCollection} = require("../models/mongodb")
const {transactionCollection} = require("../models/mongodb")
const {deleteAccountCollection} = require("../models/mongodb")
const {queriesCollection} = require("../models/mongodb")
const {loanRequestCollection} = require("../models/mongodb")
const {accountOpenRequests} = require("../models/mongodb")
const {adminLoginCollection} = require("../models/mongodb")

router.get("/login-admin", function (req, res) {
    isAdminLogged = false;
    res.render("login_admin", {projectName: projectName});
});

router.get("/admin_main", async function (req, res) {
    if (isAdminLogged) {
        res.render("admin_main", {
            name: adminName,
            projectName: projectName,
            assets: "$500 billion",
            liabilities: "$400 billion",
            revenue: "$50 billion",
            profits: "$10 billion",
            loan_portfolios: "$10 billion",
            credit_risk: "5%",
            market_risk: "2.5%",
            dateString: dateString.getDate(),
            stockPrice: "$44.20 per share",
        });
    } else {
        res.redirect("/");
    }
});

router.get("/admin_main/view_transactions", async function
    (req, res) {
    if (isAdminLogged) {
        try {
            const transactions = await transactionCollection.find({});
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                amount.push(transactions[i].amount);
                to_from.push(transactions[i].recipient + "   /   " + transactions[i].sender_acc_no);
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            res.render("admin_view_transactions", {
                name: adminName,
                projectName: projectName,
                transactions_length: transactions_length,
                amount: amount,
                to_from: to_from,
                date: date,
                time: time,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect("/");
    }
});

router.get("/admin_main/view_queries", async function (req, res) {
    if (isAdminLogged) {
        try {
            const queries = await queriesCollection.find({status: "Pending"});
            let query_length = queries.length;
            let names = [];
            let phones = [];
            let acc_no = [];
            let title = [];
            let message = [];
            for (let i = 0; i < query_length; i++) {
                names.push(queries[i].name);
                phones.push(queries[i].phone);
                acc_no.push(queries[i].acc_no);
                title.push(queries[i].title);
                message.push(queries[i].message);
            }
            res.render("admin_queries", {
                length: query_length,
                projectName: projectName,
                names: names,
                phones: phones,
                acc_no: acc_no,
                title: title,
                message: message,
                details: queries,
                name: adminName,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect("/main");
    }
});

router.get("/admin_main/loan", async function (req, res) {
    if (isAdminLogged) {
        let loan_amount = [];
        let loan_type = [];
        let reason = [];
        let credit_score = [];
        const loans = await loanRequestCollection.find({status: "Pending"});
        let loan_length = loans.length;
        for (let i = 0; i < loan_length; i++) {
            loan_amount.push(loans[i].loan_amount.toString());
            loan_type.push(loans[i].loan_type.toString());
            reason.push(loans[i].reason.toString());
            credit_score.push(Math.floor(Math.random() * 201) + 700);
        }
        res.render("admin_loan", {
            projectName: projectName,
            name: adminName,
            loan_type: loan_type,
            loan_length: loan_length,
            reason: reason,
            credit_score: credit_score,
            loan_amount: loan_amount,
            loans: loans,
        });
    } else {
        res.redirect("/");
    }
});

router.get("/admin_main/loan/:acc_no", async function (req, res) {
    let acc_no = req.params.acc_no;
    if (isAdminLogged) {
        const account_details = await accountCollection.findOne({_id: acc_no});
        let date_string = dateString.getDate();
        try {
            const balanceDoc = await balanceCollection.findOne({accountNumber: acc_no});
            const balance = balanceDoc.balance;
            const transactions = await transactionCollection.find({
                $or: [{sender_acc_no: acc_no}, {recipient: acc_no}],
            });
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                if (acc_no === transactions[i].sender_acc_no.toString()) {
                    amount.push("-" + transactions[i].amount.toString());
                    to_from.push(transactions[i].recipient.toString());
                } else if (acc_no === transactions[i].recipient) {
                    amount.push("+" + transactions[i].amount.toString());
                    to_from.push(transactions[i].sender_acc_no.toString());
                }
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            res.render("admin_account_viewing", {
                projectName: projectName,
                fName: account_details.firstName,
                dates: date_string,
                lName: account_details.lastName,
                acc_no: acc_no,
                balance: balance,
                transactions_length: transactions_length,
                amount: amount,
                to_from: to_from,
                date: date,
                time: time,
                name: adminName
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect("/");
    }
});

router.get("/admin_main/account_requests", async function (req, res) {
    if (isAdminLogged) {
        let accountOpen = await accountOpenRequests.find({status: "Pending"});
        let openAccountLength = accountOpen.length;
        res.render("account_requests", {
            projectName: projectName,
            name: adminName,
            details: accountOpen,
            length: openAccountLength
        });
    } else {
        res.redirect("/");
    }
});

router.get("/admin_main/delete_account", async function (req, res) {
    if (isAdminLogged) {

        let account_number = [];
        let reason = [];
        let aadhar_number = [];
        const del_acc = await deleteAccountCollection.find();
        const del_len = del_acc.length
        for (let i = 0; i < del_len; i++) {
            account_number.push(del_acc[i].accountNumber.toString());
            reason.push(del_acc[i].reason.toString());
            aadhar_number.push(del_acc[i].aadhar.toString());
        }
        res.render("delete_account", {
            projectName: projectName,
            account_number: account_number,
            reason: reason,
            aadhar_number: aadhar_number,
            del_len: del_len,
            name: adminName,
            del_acc: del_acc
        })
    } else {
        res.redirect("/");
    }
});

router.get("/admin_main/form/:id", async (req, res) => {
    if (isAdminLogged) {
        const fileId = req.params.id;
        const result = await accountOpenRequests.findOne({formPath: fileId}).catch(err => console.log(err.message));
        if (!result) {
            console.log("File not found.");
        } else {
            const file = fs.createReadStream(`./uploaded_forms/${fileId}`);
            res.setHeader("Content-Type", "application/pdf");
            file.pipe(res);
        }
    } else {
        res.redirect("/");
    }

});

router.get("/admin_main/deleteAccount/:acc_no",
    async function (req, res) {
        let acc_no = req.params.acc_no;
        if (isAdminLogged) {
            const account_details = await accountCollection.findOne({_id: acc_no});
            let date_string = dateString.getDate();
            try {
                const balanceDoc = await balanceCollection.findOne({accountNumber: acc_no});
                const balance = balanceDoc.balance;
                const transactions = await transactionCollection.find({
                    $or: [{sender_acc_no: acc_no}, {recipient: acc_no}],
                });
                let transactions_length = transactions.length;
                let amount = [];
                let to_from = [];
                let date = [];
                let time = [];
                for (let i = 0; i < transactions_length; i++) {
                    if (acc_no === transactions[i].sender_acc_no.toString()) {
                        amount.push("-" + transactions[i].amount.toString());
                        to_from.push(transactions[i].recipient.toString());
                    } else if (acc_no === transactions[i].recipient) {
                        amount.push("+" + transactions[i].amount.toString());
                        to_from.push(transactions[i].sender_acc_no.toString());
                    }
                    date.push(transactions[i].date);
                    time.push(transactions[i].time);
                }
                res.render("admin_account_viewing", {
                    projectName: projectName,
                    fName: account_details.firstName,
                    dates: date_string,
                    lName: account_details.lastName,
                    acc_no: acc_no,
                    balance: balance,
                    transactions_length: transactions_length,
                    amount: amount,
                    to_from: to_from,
                    date: date,
                    time: time,
                    name: adminName
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            res.redirect("/");
        }
    });


router.post("/admin_main/login-admin", async function (req, res) {
    let UID = req.body.admin_id;
    let password = req.body.password;
    const user = await adminLoginCollection.findOne({
        UID: UID
    })
    if (!user) {
        res.send("No Admin ID found.")
    } else {
        if (password === user.password) {
            isAdminLogged = true;
            adminName = user.name;
            res.redirect("/admin/admin_main");
        } else {
            res.send("Details do not match.");
        }
    }
});

router.post("/admin_main/loan/accept", async function
    (req, res) {
    const loanId = req.body.loan_id;
    try {
        const result = await loanRequestCollection.updateOne(
            {_id: loanId},
            {$set: {status: "Accepted"}}
        );
        console.log("ok");
        res.redirect("/admin/admin_main/loan");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while accepting the loan request.");
    }
});

router.post("/admin_main/loan/reject", async function
    (req, res) {
    const loanId = req.body.loan_id;
    try {
        const result = await loanRequestCollection.updateOne(
            {_id: loanId},
            {$set: {status: "Rejected"}}
        );
        res.redirect("/admin/admin_main/loan");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while rejecting the loan request.");
    }
});

router.post("/admin_main/account_requests/accept", async function
    (req, res) {
    const accountRequestId = req.body.request_id;
    try {
        await accountOpenRequests.updateOne(
            {_id: accountRequestId},
            {$set: {status: "Accepted"}}
        );
        const result = await accountOpenRequests.findOne({
            _id: accountRequestId
        });
        await accountCollection.create({
            firstName: result.first_name,
            lastName: result.last_name,
            eMail: result.email,
            password: result.password,
        });
        const acc_no = await accountCollection.findOne({
            firstName: result.first_name,
            lastName: result.last_name,
            eMail: result.email,
            password: result.password
        })
        await balanceCollection.create({
            accountNumber: acc_no._id,
            balance: 0
        });
        res.redirect("/admin/admin_main/account_requests");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while accepting account opening requests.");
    }
});

router.post("/admin_main/account_requests/reject", async function (
    req, res) {
    const accountRequestId = req.body.request_id;
    try {
        await accountOpenRequests.updateOne(
            {_id: accountRequestId},
            {$set: {status: "Rejected"}}
        );
        res.redirect("/admin/admin_main/account_requests");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while rejecting account opening requests.");
    }
});

router.post("/admin_main/del_acc/accept", async function
    (req, res) {
    const delAccountId = req.body.del_acc_id;
    try {
        await accountCollection.deleteOne({
            _id: delAccountId
        });
        await balanceCollection.deleteOne({
            accountNumber: delAccountId
        });
        await deleteAccountCollection.deleteOne({
            accountNumber: delAccountId
        });
        res.redirect("/admin/admin_main/delete_account");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred.");
    }
});

router.post("/admin_main/del_acc/reject", async function
    (req, res) {
    const delAccountId = req.body.del_acc_id;
    try {
        await deleteAccountCollection.deleteOne({
            accountNumber: delAccountId
        });
        res.redirect("/admin/admin_main/delete_account");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred.");
    }
});

router.get("/admin_main/queries/:acc_no", async function (req, res) {
    let acc_no = req.params.acc_no;
    if (isAdminLogged) {
        const account_details = await accountCollection.findOne({_id: acc_no});
        let date_string = dateString.getDate();
        try {
            const balanceDoc = await balanceCollection.findOne({accountNumber: acc_no});
            const balance = balanceDoc.balance;
            const transactions = await transactionCollection.find({
                $or: [{sender_acc_no: acc_no}, {recipient: acc_no}],
            });
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                if (acc_no === transactions[i].sender_acc_no.toString()) {
                    amount.push("-" + transactions[i].amount.toString());
                    to_from.push(transactions[i].recipient.toString());
                } else if (acc_no === transactions[i].recipient) {
                    amount.push("+" + transactions[i].amount.toString());
                    to_from.push(transactions[i].sender_acc_no.toString());
                }
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            res.render("admin_account_viewing", {
                projectName: projectName,
                fName: account_details.firstName,
                dates: date_string,
                lName: account_details.lastName,
                acc_no: acc_no,
                balance: balance,
                transactions_length: transactions_length,
                amount: amount,
                to_from: to_from,
                date: date,
                time: time,
                name: adminName
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect("/");
    }
});

router.post("/admin_main/view_queries/resolve", async function
    (req, res) {
    const queryId = req.body.query_id;
    try {
        await queriesCollection.updateOne({_id: queryId}, {$set: {status: "Resolved"}});
        res.redirect("/admin/admin_main/view_queries");
    } catch (error) {
        console.log(error);
    }
});

router.post("/admin_main/view_transactions/search-specific", async function
    (req, res) {
    if (isAdminLogged) {
        const acc_no = req.body.search_query;
        try {
            const transactions = await transactionCollection.find({
                $or: [{sender_acc_no: acc_no}, {recipient: acc_no}],
            });
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                amount.push(transactions[i].amount);
                to_from.push(transactions[i].recipient + "   /   " + transactions[i].sender_acc_no);
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            res.render("admin_view_transactions", {
                name: adminName,
                projectName: projectName,
                transactions_length: transactions_length,
                amount: amount,
                to_from: to_from,
                date: date,
                time: time,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send("An error occurred.");
        }
    } else {
        res.redirect("/");
    }
});

router.post("/admin_main/view_transactions/search-all", async function
    (req, res) {
    if (isAdminLogged) {
        const acc_no = req.body.search_query;
        try {
            const transactions = await transactionCollection.find({});
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                amount.push(transactions[i].amount);
                to_from.push(transactions[i].recipient + "   /   " + transactions[i].sender_acc_no);
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            res.render("admin_view_transactions", {
                name: adminName,
                projectName: projectName,
                transactions_length: transactions_length,
                amount: amount,
                to_from: to_from,
                date: date,
                time: time,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send("An error occurred.");
        }
    } else {
        res.redirect("/");
    }
});

router.post("/admin_main/loan/search_query", async function
    (req, res) {
    const loanType = req.body.search_query;
    if (isAdminLogged) {
        let loan_amount = [];
        let loan_type = [];
        let reason = [];
        let credit_score = [];
        const loans = await loanRequestCollection.find({$and: [{loan_type: loanType}, {status: "Pending"}]});
        let loan_length = loans.length;
        for (let i = 0; i < loan_length; i++) {
            loan_amount.push(loans[i].loan_amount.toString());
            loan_type.push(loans[i].loan_type.toString());
            reason.push(loans[i].reason.toString());
            credit_score.push(Math.floor(Math.random() * 201) + 700);
        }
        res.render("admin_loan", {
            projectName: projectName,
            name: adminName,
            loan_type: loan_type,
            loan_length: loan_length,
            reason: reason,
            credit_score: credit_score,
            loan_amount: loan_amount,
            loans: loans
        });
    } else {
        res.redirect("/");
    }
});

router.post("/admin_main/loan/search_all", async function
    (req, res) {
    const loanType = req.body.search_query;
    if (isAdminLogged) {
        let loan_amount = [];
        let loan_type = [];
        let reason = [];
        let credit_score = [];
        const loans = await loanRequestCollection.find({status: "Pending"});
        let loan_length = loans.length;
        for (let i = 0; i < loan_length; i++) {
            loan_amount.push(loans[i].loan_amount.toString());
            loan_type.push(loans[i].loan_type.toString());
            reason.push(loans[i].reason.toString());
            credit_score.push(Math.floor(Math.random() * 201) + 700);
        }
        res.render("admin_loan", {
            projectName: projectName,
            name: adminName,
            loan_type: loan_type,
            loan_length: loan_length,
            reason: reason,
            credit_score: credit_score,
            loan_amount: loan_amount,
            loans: loans
        });
    } else {
        res.redirect("/");
    }
});


module.exports = router;