import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import config  from "../config/config.js";

const { verify } = jwt; 


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "Email is already exists"],
        trim: true,
        lowercase: true,
        minLength: [3, "username atleast must be at least 3 character"],
        maxLength: [15, "username most be at 25 character"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already exists"],
        trim: true,
        lowercase: true,
        minLength: [3, "Email atleast must be at least 3 character"],
        maxLength: [20, "Email most be at 40 charecter"],
    },

    profileImage: {
        type: String,
        default:
            "https://imgs.search.brave.com/skDNwq7zZQO3Fx033dB2EKjvJZNncIpdZ3hk47OSVTU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWxldmVuZm9ydW0u/Y29tL2RhdGEvYXR0/YWNobWVudHMvODIv/ODI1MjktYWRlNjNl/NDIwOTcwOTI5MjE4/M2Y2NTQ5MDdiMTY4/ZjUuanBnP2hhc2g9/cmVZLVFnbHdrcA",
    },

    password:{
        type:String,
        select:false
    },

});

userSchema.statics.hashPassword =async function (password) {
    if(!password){
        throw new Error("pasword is required");
    }

    const salt =await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}


userSchema.methods.comparePassword = async function (password) {
    if(!password){
        throw new Error("password is required");
        
    }
    if(!this.password){
        throw new Error("password is required");
        
    }
    return bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken = function(){
    
    const token = jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
        },
        config.JWT_SECRET,
        {
            expiresIn:config.JWT_EXPIRES_IN
        })
    return token;
}


userSchema.statics.verifyToken =  function(token){
    if(!token){
        throw new Error("token is required")
    }
    return jwt.verify(token,config.JWT_SECRET)
}



const userModel = mongoose.model("user",userSchema)

const user = userModel.findOne()

export default userModel;