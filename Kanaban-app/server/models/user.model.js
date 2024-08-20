import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true, unique:true, },
    password:{type:String,required:true, minlength:5},
    role:{type:String, enum:["admin","user"], default:"user", required:true}
},{
    versionKey: false,
    timestamps : true
})

const UserModel = mongoose.model("user", userSchema)

export default UserModel