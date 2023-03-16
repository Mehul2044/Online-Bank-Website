const express = require("express");
const app = express();
const bodyParse = require("body-parser");
// const collection = require("./mongodb");
const relation = require("./sqlite");

const port = 3000;
const projectName = "MyBank";

const db = relation.connect();
relation.createTables(db);

let isLogged = false;

app.use(bodyParse.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    isLogged = false;
    res.render("home_page", { projectName: projectName });
});

app.get("/login", function (req, res) {
    res.render("login", { projectName: projectName });
});

app.get("/registration", function (req, res) {
    res.render("registration", { projectName: projectName });
});

app.get("/about", function (req, res) {
    res.render("about_us", { projectName: projectName });
});

app.get("/main", function (req, res) {
    if (isLogged) {
        res.render("main", { projectName: projectName })
    } else {
        res.redirect("/login")
    }
})

// app.post("/register", async (req, res) => {
//     if (await collection.findOne({eMail: req.body.eMail})) {
//         console.log(req.body);
//         res.status(400).send({
//             message: "Email already exists"
//         });
//     } else {
//         await new collection(req.body).save();
//         isLogged = true;
//         res.redirect("/main");
//     }
// })

// app.post("/login", async (req, res) => {
//     try {
//         const check = await collection.findOne({name: req.body.name})
//         if (check.password === req.body.password) {
//             isLogged = true;
//             res.redirect("/main")
//         } else {
//             res.send("wrong password")
//         }
//     } catch {
//         res.send("wrong details")
//     }
// })

app.post("/login", async (req, res) => {
    account_number = req.body.account_number;
    password = req.body.password;
    await db.get("SELECT password FROM accounts WHERE account_number = ?", [account_number], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row) {
            console.log("yey")
            let password_check;
            console.log(row.password);
            password_check = row.password
            console.log(password_check);
            console.log(password);
            if (password_check === password) {
                isLogged = true;
                res.redirect("/main")
            }
        }
    });
})

app.post("/register", async (req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let eMail = req.body.eMail
    let password = req.body.password

    let exist = false;
    await db.get(`SELECT * FROM user WHERE eMail = ?`, [eMail], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row) {
            console.log(`Account already exists.`);
            exist = true;
        }
    });

    if (exist) {
        res.status(400).send({
            message: "Account already exists."
        });
    }

    else {
        db.run("insert into accounts (fname, lname, email, password) values ('" + firstName + "','" + lastName + "','" + eMail + "','" + password + "')", err => {
            if (err) {
                console.log(err);
            } else {
                console.log("Inserted data");
                isLogged = true;
                res.redirect("/main");
            }
        });
    }

})

app.listen(port, function () {
    console.log("Server is running on port " + port + ".");
});