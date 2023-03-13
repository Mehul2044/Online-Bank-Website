const express = require("express");
const server = express();
const bodyParse = require("body-parser");
const collection = require("./mongodb")

const port = 3000;
const projectName = "MyBank";

server.use(bodyParse.urlencoded({extended: true}));
server.use(express.static("assets"));
server.set("view engine", "ejs");

server.get("/", function (req, res) {
    res.render("home_page", {projectName: projectName});
});

server.get("/login", function (req, res) {
    res.render("login", {projectName: projectName});
});

server.get("/registration", function (req, res) {
    res.render("registration", {projectName: projectName});
});

server.get("/about", function (req, res) {
    res.render("about_us", {projectName: projectName});
});

server.get("/main", function (req, res){
    res.render("main", {projectName: projectName})
})

server.post("/register", async(req, res)=>{
    if(await collection.findOne({eMail: req.body.eMail})){
        console.log(req.body);
        res.status(400).send({
            message: "Email already exists"
        })
        return
    }
    await new collection(req.body).save()
    res.redirect("/main")
    res.render("main", {projectName: projectName})
})

server.post("/login", async(req, res)=>{
    try{
        const check = await collection.findOne({name:req.body.name})
        if(check.password===req.body.password){
            res.redirect("/main")
            res.render("main", {projectName: projectName})
        }
        else{
            res.send("wrong password")
        }
    }
    catch{
        res.send("wrong details")
    }
})

server.listen(port, function () {
    console.log("Server is running on port " + port + ".");
});