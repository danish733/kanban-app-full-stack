import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connection from "./config/db.js"
import userRouter from "./routes/user.route.js"
import kanbanRoutes from "./routes/kanban.route.js"

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors({origin:"*"}))
app.use(express.json())
app.use("/user", userRouter)
app.use("/kanban", kanbanRoutes)


app.get("/",(req,res)=>{
    res.send("Welcome to Kanban app")
})

app.listen(PORT,async()=>{
    try {
        await connection
        console.log(`Server is running on port ${PORT} and db is connected`)
    } catch (error) {
        console.log("Error in Connecting Server & Database")
    }
})