const mongoose = require("mongoose")
require("dotenv").config()

const Account = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    eMail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const DeleteAccount = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true
    }
})

const Balance = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Queries = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 30
    },
    phone: {
        type: Number,
        required: true
    },
    acc_no: {
        type: String
    },
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    message: {
        type: String,
        required: true,
        maxLength: 200
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    }
});

const Transactions = new mongoose.Schema({
    sender_acc_no: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    recipient: {
        type: String,
        required: true,
        maxLength: 30
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

const LoanRequest = new mongoose.Schema({
    acc_no: {
        type: String,
        required: true,
    },
    loan_amount: {
        type: Number,
        required: true
    },
    loan_type: {
        type: String,
        required: true,
        maxLength: 20
    },
    reason: {
        type: String,
        required: true,
        maxLength: 100
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    }
});

const AccountOpenRequests = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    formPath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending",
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const AdminLogins = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    UID: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = {
    accountCollection: mongoose.model("Account", Account),
    deleteAccountCollection: mongoose.model("Account Deletion", DeleteAccount),
    balanceCollection: mongoose.model("Balance", Balance),
    queriesCollection: mongoose.model("Queries", Queries),
    transactionCollection: mongoose.model("Transactions", Transactions),
    loanRequestCollection: mongoose.model("Loan Requests", LoanRequest),
    accountOpenRequests: mongoose.model("Account Open Requests", AccountOpenRequests),
    adminLoginCollection: mongoose.model("Admin Login", AdminLogins)
};

module.exports.connect = function () {
    try {
        mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err);
    }
}