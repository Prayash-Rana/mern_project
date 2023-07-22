require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 4000 ;

const securePassword = async(password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  const passwordMatch = await bcrypt.compare("hello", passwordHash);
  console.log(passwordMatch);
}

securePassword("hlw");


const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.urlencoded({extended:false}));

app.set("view engine", "hbs");
app.set("views",views_path);
hbs.registerPartials(partials_path);

// app.use(express.static(static_path));


console.log(process.env.SECRET_KEY);


app.get("/", (req,res) => {
    res.render("index.hbs");
})

app.get("/login", (req,res) => {
    res.render("login.hbs");
})

app.get("/register", (req,res) => {
    res.render("register.hbs");
})
//create a new user in our database
app.post("/register", async(req,res) => {
    
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname);
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password === confirmPassword){
            const regEmployee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                age : req.body.age,
                password : req.body.password,
                confirmPassword : confirmPassword
            });
        console.log("the regEmployee is :",regEmployee);
          const token = await regEmployee.generateAuthToken();
          console.log("the app token is :" , token);

          const registered = await regEmployee.save();
          res.status(201).render("index.hbs");

        }else{
            res.send("password not matched");
        }

        
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})

// //login check
app.post("/login", async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        

       const userEmail = await Register.findOne({email : email});
       const isMatch = await bcrypt.compare(password , userEmail.password)
       const token = await userEmail.generateAuthToken();
       
       if  (isMatch){
            console.log("password matched");
            res.status(201).render("index.hbs")
       }
       else{
        res.send("password not matched");
       }

        
    } catch (error) {

        res.status(400).send("invalid email");
    }
})

// const createToken = async() => {
//   const token = await jwt.sign({_id:"64b7f92c7605fc598e3780f4"} , "mynameisprayashsaharana", {
//     expiresIn : "2 seconds"
//   });
//   console.log("token is :", token);

//   const userVerify = await jwt.verify(token, "mynameisprayashsaharana")
//   console.log("user verify is: ",userVerify);
// }
// createToken();

app.listen(port , () => {
    console.log(`listening the port no ${port}`);
})