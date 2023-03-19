const mongoose = require("mongoose")
require("dotenv").config();

try {
    mongoose.connect(process.env.DB_URL);
}
catch(e) {
    console.log(e)
}

const LogInSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : true
    },
    lastName:{
        type : String,
        required : true
    },
    eMail:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    }
})

const collection = new mongoose.model("Collection_1", LogInSchema);
module.exports = collection;