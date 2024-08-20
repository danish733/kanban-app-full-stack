import mongoose from "mongoose"

const kanbanSchema = mongoose.Schema({
    title:{type:String,required:true},
    status:{type:String, enum:["to-do","in-progress","completed"],default:"to-do"},
    kanbanUserId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

const KanbanModel = mongoose.model("kanban",kanbanSchema)

export default KanbanModel