import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String },
  workSpaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  owner: { type: String },
  type: { type: String },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },  
  fileUrl: String,
});

export default mongoose.model("document", documentSchema);
