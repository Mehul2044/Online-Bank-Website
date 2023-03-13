const express = require("express");
const server = express();
const bodyParse = require("body-parser");

const port = 3000;
const projectName = "MyBank";

server.use(bodyParse.urlencoded({extended: true}));
server.use(express.static("assets"));
server.set("view engine", "ejs");

server.listen(port, function () {
    console.log("Server is running on port " + port + ".");
});

server.get("/", function (req, res) {
    res.render("home_page", {projectName: projectName});
});

server.get("/login", function (req, res) {
    res.render("login", {projectName: projectName + " - Login"});
});

server.get("/registration", function (req, res) {
    res.render("registration", {projectName: projectName + " - Register"});
});

server.get("/about", function (req, res) {
    res.render("about_us", {projectName: projectName + " - About"});
});