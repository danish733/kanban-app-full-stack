import express from "express"
import UserModel from "../models/user.model.js"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
const userRouter = express()

userRouter.get("/",(req,res)=>{
    res.send("this is user get route")
})

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,role} = req.body
    const existingUser = await UserModel.findOne({email})
    try {
        if(existingUser){
            return res.status(404).json({message:"Email already exist"})
        }
        await bcrypt.hash(password,3,async(err,hash)=>{
            if(err){
               return res.status(404).json({message:"Error in hashing password "})
            }
            const registerUser = new UserModel({
                name,
                email,
                password:hash,
                role
            })
            await registerUser.save()
            res.status(201).json({message:"User regsiter Success"})
        })

    } catch (error) {
        res.status(404).json({message:"Server Error while Registering"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(404).json({message:"User Not Found Please Register"})
        }
        if(user){
            bcrypt.compare(password,user.password, async(err,result)=>{
                if(err){
                    return res.status(404).json({message:"Wrong Password"})
                }
                if(result){
                    const token = jwt.sign({id:user._id, name:user.name}, process.env.JWT_KEY)
                    res.status(200).json({message:"user logged in suceess", token})
                }
            })
        }
    } catch (error) {
        res.status(404).json({message:"Server Error while Login"})
    }
})

export default userRouter