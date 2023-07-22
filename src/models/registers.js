const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String ,
        required : true,
    },
    email : {
        type : String , 
        required :true , 
        unique : true
    },
    gender : {
        type : String , 
        required : true
    },
    age : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    confirmPassword : {
        type : String, 
        required : true
    },
    tokens : [{
        token :{
            type : String,
            required : true,
        }
    }]
})
//generate tokens 
employeeSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id : this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        console.log("token schema is :", token);
        await this.save();
        return token; 
    } catch (error) {
        res.send("error schema is : ", error);
        console.log("error schema is :: ", error);
    }
}

// employeeSchema.methods.generateAuthToken = async() => {
//     try {
//         const token = await jwt.sign({_id :this._id.toString()}, "mynameisprayashsaharanawebdevelopmentlearning");
//         console.log("taken schema is:",token);

//         this.tokens = this.tokens.concat({token : token});
//         await this.save();
//         return token ;
//     } catch (error) {
//         res.send("the error schema part is :", error);
//         console.log("the error shema is :", error);
//     }
// }


//converting password into hash
employeeSchema.pre("save", async function(next) {
    if(this.isModified("password")){
    
    // console.log(`cureent password is ${this.password}`);
    this.password = await bcrypt.hash(this.password , 10);
    // console.log(`cureent password is ${this.password}`);

    this.confirmPassword = await bcrypt.hash(this.password ,10);
    // this.confirmPassword = undefined;

        
    }
    next();
})

//now we need to create a collection
const Register = new mongoose.model("Register" , employeeSchema);

module.exports  = Register ; 