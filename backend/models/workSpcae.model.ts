import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const workSpaceSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  nid: { type: String, require: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('workSpace' ,workSpaceSchema)


