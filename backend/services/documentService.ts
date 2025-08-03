import DocumentModel from "../models/DocumentsSchema.model";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const uploadDocument = async (
  file: Express.Multer.File,
  owner: string,
  workSpaceId: string,
  tags: string[] = []
) => {
  const fileUrl = `/uploads/${file.filename}`;
  const newDoc = await DocumentModel.create({
    name: file.originalname,
    type: file.mimetype,
    owner,
    workSpaceId,
    fileUrl,
    tags,
  });
  return newDoc;
};

function isValidObjectId(id: any): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export const getDocumentsByWorkspace = async (
  workSpaceId?: string,
  search?: string,
  sort = "createdAt",
  order = "desc",
  type?: string,
  owner?: string,
  startDate?: string,
  endDate?: string,
  tags?: string
) => {
  const filter: any = {
    deleted: { $ne: true },
  };

  if (workSpaceId && isValidObjectId(workSpaceId)) {
    filter.workSpaceId = new mongoose.Types.ObjectId(workSpaceId);
  }

  if (owner && isValidObjectId(owner)) {
    filter.owner = new mongoose.Types.ObjectId(owner);
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (type) {
  const typeMap: Record<string, string[]> = {
    pdf: ["application/pdf"],
    doc: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    img: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
  };

  if (typeMap[type]) {
    filter.type = { $in: typeMap[type] };
  }
}


  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (tags) {
    filter.tags = { $in: tags.split(",").map((t) => t.trim()) };
  }

  return await DocumentModel.find(filter)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .select(
      "name type owner tags createdAt deleted deletedAt fileUrl workSpaceId"
    );
};

export const searchDocuments = async (
  workSpaceId: string,
  search?: string,
  sort = "createdAt",
  order = "desc",
  type?: string,
  startDate?: string,
  endDate?: string,
  tags?: string
) => {
  const filter: any = {
    workSpaceId: new mongoose.Types.ObjectId(workSpaceId),
  };

  if (search) filter.name = { $regex: search, $options: "i" };
  if (type) {
    const typeMap: Record<string, string[]> = {
      pdf: ["application/pdf"],
      doc: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      img: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
    };

    if (typeMap[type]) {
      filter.type = { $in: typeMap[type] };
    }
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (tags) {
    filter.tags = { $in: tags.split(",").map((t) => t.trim()) };
  }

  return await DocumentModel.find(filter).sort({
    [sort]: order === "asc" ? 1 : -1,
  });
};

export const downloadDocument = async (documentId: string) => {
  const document = await DocumentModel.findById(documentId);

  if (!document || !document.fileUrl) {
    throw new Error("Document not found");
  }

  const filename = path.basename(document.fileUrl);
  const filePath = path.join(__dirname, "..", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found on server");
  }

  return { filePath, fileName: document.name };
};

export const softDeleteDocument = async (documentId: string) => {
  const updatedDoc = await DocumentModel.findByIdAndUpdate(
    documentId,
    { deleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!updatedDoc) {
    throw new Error("Document not found");
  }

  return updatedDoc;
};

export const updateDocumentMetadata = async (
  documentId: string,
  updates: { name?: string; tags?: string[] }
) => {
  return await DocumentModel.findByIdAndUpdate(
    documentId,
    { $set: updates },
    { new: true }
  ).lean();
};

const getImagePreviewBase64 = async (imagePath: string): Promise<string> => {
  const previewPath = imagePath + "_preview.jpg";

  if (fs.existsSync(previewPath)) {
    return fs.readFileSync(previewPath).toString("base64");
  }

  const resizedBuffer = await sharp(imagePath)
    .resize({ width: 1200 })
    .jpeg({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(previewPath, resizedBuffer);
  return resizedBuffer.toString("base64");
};

export const previewDocument = async (documentId: string) => {
  const document = await DocumentModel.findById(documentId);

  if (!document || !document.fileUrl) {
    throw new Error("Document not found");
  }

  const filename = path.basename(document.fileUrl);
  const filePath = path.join(__dirname, "..", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found on server");
  }

  let base64Data: string;

  if (document.type?.startsWith("image/")) {
    base64Data = await getImagePreviewBase64(filePath);
  } else if (document.type === "application/pdf") {
    console.log("Reading full PDF file for preview:", filePath);
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfSignature = pdfBuffer.subarray(0, 4).toString();
    if (!pdfSignature.includes("PDF")) {
      console.error("File does not appear to be a valid PDF:", pdfSignature);
      throw new Error("Invalid PDF file");
    }

    base64Data = pdfBuffer.toString("base64");
    console.log("PDF base64 prefix:", base64Data.substring(0, 30));
  } else {
    base64Data = fs.readFileSync(filePath).toString("base64");
  }

  return {
    documentId: document._id,
    fileName: document.name,
    mimeType: document.type,
    base64Data,
  };
};

export const getAllDeletedDocuments = async (
  search?: string,
  sort = "deletedAt",
  order = "desc"
) => {
  const filter: any = {
    deletedAt: { $ne: null },
  };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  return await DocumentModel.find(filter)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .select(
      "name type owner tags createdAt deleted deletedAt fileUrl workSpaceId"
    );
};

export const permanentlyDeleteDocument = async (documentId: string) => {
  const doc = await DocumentModel.findByIdAndDelete(documentId);
  if (!doc) {
    throw new Error("Document not found");
  }


  if (!doc?.fileUrl) {
    throw new Error("File URL is missing");
  }

  const filename = path.basename(doc.fileUrl);
  const filePath = path.join(__dirname, "..", "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return doc;
};

export const restoreDocument = async (documentId: string) => {
  const doc = await DocumentModel.findByIdAndUpdate(
    documentId,
    { deleted: false, deletedAt: null },
    { new: true }
  );

  if (!doc) {
    throw new Error("Document not found");
  }

  return doc;
};
