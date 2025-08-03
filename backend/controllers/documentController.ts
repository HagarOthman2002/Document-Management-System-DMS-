import { Request, Response } from "express";
import * as documentService from "../services/documentService";

export const uploadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const { owner, workSpaceId, tags } = req.body;

    if (!files || files.length === 0) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

   
    const tagsArray = tags ? tags.split(",").map((t: string) => t.trim()) : [];

    const uploadedDocs = [];

    for (const file of files) {
      const document = await documentService.uploadDocument(
        file,
        owner,
        workSpaceId,
        tagsArray
      );
      uploadedDocs.push(document);
    }

    res.status(201).json({
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
    const {
      search,
      sort = "createdAt",
      order = "desc",
      type,
      owner,
      startDate,
      endDate,
      tags
    } = req.query;

    const documents = await documentService.getDocumentsByWorkspace(
      workSpaceId,
      search as string,
      sort as string,
      order as string,
      type as string,
      owner as string,
      startDate as string,
      endDate as string,
      tags as string
    );

    res.status(200).json({ status: "success", documents });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch documents" });
  }
};


export const searchDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workSpaceId } = req.params;
    const { search, sort = "createdAt", order = "desc", type } = req.query;

    const documents = await documentService.searchDocuments(
      workSpaceId,
      search as string,
      sort as string,
      order as string,
      type as string
    );

    res.status(200).json({ status: "success", documents });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to search documents" });
  }
};

export const downloadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { documentId } = req.params;
    const { filePath, fileName } = await documentService.downloadDocument(
      documentId
    );

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ status: "error", message: "Download failed" });
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(404).json({
      status: "error",
      message: error.message || "Document not found",
    });
  }
};

export const softDeleteDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedDoc = await documentService.softDeleteDocument(id);

    res.json({
      status: "success",
      message: "Document soft-deleted",
      document: updatedDoc,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(404).json({
      status: "error",
      message: error.message || "Soft delete failed",
    });
  }
};


export const updateDocumentMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const { name, tags } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (Array.isArray(tags)) updateData.tags = tags;

    const doc = await documentService.updateDocumentMetadata(documentId, updateData);

    if (!doc) {
      res.status(404).json({ status: "error", message: "Document not found" });
      return;
    }

    res.status(200).json({
      status: "success",
      updatedMetadata: {
        name: doc.name,
        type: doc.type,
        owner: doc.owner,
        tags: doc.tags,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Failed to update metadata" });
  }
};



export const previewDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { documentId } = req.params;
    const documentPreview = await documentService.previewDocument(documentId);
    res.status(200).json({
      status: "success",
      document: documentPreview,
    });
  } catch (error: any) {
    console.error(error.message);
    res
      .status(404)
      .json({ status: "error", message: error.message || "Preview failed" });
  }
};


export const getTrashDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, sort = "deletedAt", order = "desc" } = req.query;

    const deletedDocs = await documentService.getAllDeletedDocuments(
      search as string,
      sort as string,
      order as string
    );

    res.status(200).json({ status: "success", documents: deletedDocs });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getTrashDocuments:", error.message, error.stack);
      res.status(500).json({ status: "error", message: error.message });
    } else {
      console.error("Unknown error in getTrashDocuments:", error);
      res.status(500).json({ status: "error", message: "Failed to fetch trash documents" });
    }
  }
};



export const permanentlyDeleteDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedDoc = await documentService.permanentlyDeleteDocument(id);

    res.status(200).json({
      status: "success",
      message: "Document permanently deleted",
      document: deletedDoc,
    });
  } catch (error: any) {
    console.error("Permanent delete error:", error.message);
    res.status(404).json({
      status: "error",
      message: error.message || "Permanent delete failed",
    });
  }
};

export const restoreDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const restoredDoc = await documentService.restoreDocument(id);

    res.status(200).json({
      status: "success",
      message: "Document restored successfully",
      document: restoredDoc,
    });
  } catch (error: any) {
    console.error("Restore error:", error.message);
    res.status(404).json({
      status: "error",
      message: error.message || "Restore failed",
    });
  }
};
