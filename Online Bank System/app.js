const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const collection = require("./mongodb")

const port = 3000;
const projectName = "MyBank";

let isLogged = false;

app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static("assets"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    isLogged = false;
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

app.get("/main", function (req, res){
    if(isLogged){
        res.render("main", {projectName: projectName})
    }
    else{
        res.redirect("/login")
    }
})

app.post("/register", async(req, res)=>{
    if(await collection.findOne({eMail: req.body.eMail})){
        console.log(req.body);
        res.status(400).send({
            message: "Email already exists"
        })
        return
    }
    else{
        await new collection(req.body).save()
        isLogged = true
        res.redirect("/main")
    }
})

app.post("/login", async(req, res)=>{
    try{
        const check = await collection.findOne({name:req.body.name})
        if(check.password===req.body.password){
            isLogged = true;
            res.redirect("/main")
        }
        else{
            res.send("wrong password")
        }
    }
    catch{
        res.send("wrong details")
    }
})

app.listen(port, function () {
    console.log("app is running on port " + port + ".");
});