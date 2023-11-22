import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    FirstName:{
        type:String,
        required:true,
    },
    LastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    DoB:{
        type:Date,
        required:false
    },
    Gender:{
        type:String,
        required:false
    },
    About:{
        type:String,
        required:false
    },
    Avatar:{
        type:String,
        default:null
    },
    OTP:{
        type:String,
        default:null
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Define the possible roles here
        default: "user" // Set a default role, e.g., "user"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
  });


  export default mongoose.model('User',UserSchema)
