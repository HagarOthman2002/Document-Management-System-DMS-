import { Request, Response } from "express";
import * as documentService from "../services/documentService";

export const uploadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Received files:", req.files);
console.log("Received body:", req.body);

    const files = req.files as Express.Multer.File[];
    const { owner, workSpaceId } = req.body;

    if (!files || files.length === 0) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const uploadedDocs = [];

    for (const file of files) {
      const document = await documentService.uploadDocument(
        file,
        owner,
        workSpaceId
      );
      uploadedDocs.push(document);
    }

    res
      .status(201)
      .json({
        message: "Document(s) uploaded successfully",
        documents: uploadedDocs,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDocumentsByWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workSpaceId } = req.params;
    const documents = await documentService.getDocumentsByWorkspace(
      workSpaceId
    );
    
    res.status(200).json({ status: "success", documents });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch documents" });
  }
};
