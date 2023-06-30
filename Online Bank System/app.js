require("dotenv").config();
const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const userRoutes = require("./Routers/user")
const adminRoutes = require("./Routers/admin")
const collection = require("./models/mongodb");

const port = process.env.PORT;
const projectName = "MyBank";

app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static("assets"));
app.set("view engine", "ejs");

app.use("/", userRoutes)
app.use("/admin_main",adminRoutes)

app.get("*", function (req, res) {
    res.render("page_not_found", {projectName: projectName});
});

app.listen(port, function () {
    console.log("Server is running on port " + port + ".");
    collection.connect();
    console.log("Use http://localhost:" + port + "/ to access the application.");
});