import express from "express";
import { authenticateMiddleWare } from "../utilities";
import { upload } from "../middleware/upload";

import {
  uploadDocument,
  getDocumentsByWorkspace,
  downloadDocument,
  softDeleteDocument,
  previewDocument,
  searchDocuments,
  updateDocumentMetadata,
  getTrashDocuments,
  permanentlyDeleteDocument,
  restoreDocument
} from "../controllers/documentController";

const router = express.Router();

router.post(
  "/upload",
  authenticateMiddleWare,
  upload.array("document"),
  uploadDocument
);
router.get("/trash", authenticateMiddleWare, getTrashDocuments);
router.get("/:workSpaceId", authenticateMiddleWare, getDocumentsByWorkspace);
router.get("/download/:documentId", authenticateMiddleWare, downloadDocument);
router.get("/:workSpaceId/search", authenticateMiddleWare, searchDocuments);
router.delete("/soft-delete/:id", authenticateMiddleWare, softDeleteDocument);

router.patch("/:documentId", authenticateMiddleWare, updateDocumentMetadata);
router.get("/preview/:documentId", authenticateMiddleWare, previewDocument);
router.delete("/:id/permanent", authenticateMiddleWare,permanentlyDeleteDocument);
router.patch("/:id/restore",authenticateMiddleWare, restoreDocument);


export default router;
