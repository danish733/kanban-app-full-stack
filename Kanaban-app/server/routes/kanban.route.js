import express from "express"
import auth from "../middlewares/auth.middleware.js"
import admin from "../middlewares/admin.middleware.js"
import KanbanModel from "../models/kanban.model.js"
const kanbanRoutes = express()

// without pagination
// kanbanRoutes.get("/",auth,async(req,res)=>{
//     const kanbanUserId = req.user._id
//     try {
//         const getTask = await KanbanModel.find({kanbanUserId})
//         res.status(200).json({task:getTask})
//     } catch (error) {
//         res.status(500).json({message:"Error while getting task"})
//     }
// })

// with pagination 
kanbanRoutes.get("/", auth, async (req, res) => {
    const kanbanUserId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    try {
        const getTask = await KanbanModel.find({ kanbanUserId })
            .limit(limit * 1) 
            .skip((page - 1) * limit)
            .exec();

        const count = await KanbanModel.countDocuments({ kanbanUserId });

        res.status(200).json({
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            tasks: getTask,
        });
    } catch (error) {
        res.status(500).json({ message: "Error while getting tasks" });
    }
});


kanbanRoutes.post("/create",auth,async(req,res)=>{
    const {title,status} = req.body
    const kanbanUserId = req.user._id
    try {
        const addTask = new KanbanModel({
            title,
            status,
            kanbanUserId
        })
        await addTask.save()
        res.status(201).json({message:"task added successfull"})
    } catch (error) {
        res.status(500).json({message:"Error in server while create task"})
    }
})
kanbanRoutes.patch("/update/:id",auth,async(req,res)=>{
    const payload = req.body
    const taskId = req.params.id
    const kanbanUserId = req.user._id
    
    try {
        const task = await KanbanModel.findOne({_id:taskId})
        if(task.kanbanUserId.toString() === kanbanUserId.toString()){
            await KanbanModel.findByIdAndUpdate({_id:taskId},payload)
            res.status(200).json({message:"update done"})
        }
        else{
            res.send("unauthorized")
        }
    } catch (error) {
        res.status(500).json({message:"Error in server while updating"})
    }
    
})

kanbanRoutes.delete("/delete/:id",[auth, admin],async(req,res)=>{
    const taskId = req.params.id
    const kanbanUserId = req.user._id
    
    try {
        const task = await KanbanModel.findOne({_id:taskId})
        if(task.kanbanUserId.toString() === kanbanUserId.toString()){
            await KanbanModel.findByIdAndDelete({_id:taskId})
            res.status(200).json({message:"delete done"})
        }
        else{
            res.send("unauthorized")
        }
    } catch (error) {
        res.status(500).json({message:"Error in server while deleting"})
    }
    
})

export default kanbanRoutes