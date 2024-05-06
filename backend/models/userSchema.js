import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,    
        required:[true,"Please Enter Your First Name"],
        minLength:[3,"Name should have more than 3 characters"],
    },
    lastName:{
        type:String,    
        required:[true,"Please Enter Your Last Name"],
        minLength:[3,"Name should have more than 3 characters"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        validate:[validator.isEmail,"Please Enter a valid Email"],
    },
    phone:{
        type:String,
        required:[true,"Please Enter Your Phone Number"],
        maxLength:[10,"Phone Number should not exceed 10 characters"],
        minLength:[10,"Phone Number should have more than 10 characters"],
    },
    nic:{
        type:String,
        required:[true,"Please Enter Your NIC Number"],
        minLength:[13,"NIC must contain only 13 digits"],
        maxLength:[13,"NIC must contain only 13 digits"],
    },
    dob:{
        type:Date,
        required:[true,"Please Enter Your Date of Birth"],
    },
    gender:{
        type:String,
        required:[true,"Please Enter Your Gender"],
        enum:["male","female","other"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password should be greater than 8 characters"],
        select:false
    },
    role:{
        type:String,
        required:[true,"Please Enter Your Role"],
        enum:["Patient","Doctor","Admin"],
    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id:String,
        url:String,
    },
});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.generateJsonWebToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
    })
}

export const User = mongoose.model("User",userSchema);