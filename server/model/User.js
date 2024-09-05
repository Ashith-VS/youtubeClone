import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    subscribers:{
        type:Number,
        default:0
    },
    subscribedChannels:{
    type:[String]
    },
},
{timestamps:true})

export default mongoose.model('User',UserSchema)
