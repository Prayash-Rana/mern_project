const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/RegistrationYoutube")
.then(() => console.log("mongo db connceted "))
.catch((err) => console.log("not connected mongo db"));