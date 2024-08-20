
const admin = (req,res,next)=>{
    if(req.user.role === "admin"){
        next()
    }
    else{
        res.send("user are not admin")
    }
}

export default admin