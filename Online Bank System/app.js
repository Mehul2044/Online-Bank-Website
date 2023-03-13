const express = require("express");
const app = express();
const bodyParse = require("body-parser");

const port = 3000;
const projectName = "MyBank";

app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static("assets"));
app.set("view engine", "ejs");

app.listen(port, function () {
    console.log("Server is running on port " + port + ".");
});

app.get("/", function (req, res) {
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