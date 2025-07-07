import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema({
    name : {type:String , require : true},
    content : {type:String},
    workSpaceId : {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    createdAt: { type: Date, default: Date.now }
})
export default  mongoose.model('document' , documentSchema)



