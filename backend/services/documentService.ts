import DocumentModel from "../models/DocumentsSchema.model";
import mongoose from "mongoose";

export const uploadDocument = async (file: Express.Multer.File, owner: string, workSpaceId: string) => {
  console.log("Uploading document with file:", file);
    console.log("Owner:", owner, "Workspace ID:", workSpaceId);

  const fileUrl = `/uploads/${file.filename}`;
  const newDoc = await DocumentModel.create({
    name: file.originalname,
    type: file.mimetype,
    owner,
    workSpaceId,
    fileUrl,
  });
  return newDoc;
};

export const getDocumentsByWorkspace = async (workSpaceId: string) => {
  const docs = await DocumentModel.find({
    workSpaceId: new mongoose.Types.ObjectId(workSpaceId),
  });
  return docs;
};
