import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"

const auth = async(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]
    try {
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        if(!decoded){
           return res.send(404).json({message:"user not authorized login again"})
        }
        if(decoded){
            const user = await UserModel.findById(decoded.id)
            req.user = user
            next()
        }
    } catch (error) {
        res.status(500).json({message:"Error while Authorized"})
    }
}
export default auth