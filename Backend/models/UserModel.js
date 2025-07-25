const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneno:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin","seller"],
        default:"user"
    },
    verificationEmail: {
        type: String
    },
    resetpasswordotp:{
        type:String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    location: {
    address: { type: String },
    city:    { type: String }
  },
})

const userData = mongoose.model("user",userSchema)
module.exports = userData