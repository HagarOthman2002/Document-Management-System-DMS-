import express from "express";
import { authenticateMiddleWare } from "../utilities";
import { upload } from "../middleware/upload";
import { uploadDocument ,getDocumentsByWorkspace } from "../controllers/documentController";

const router = express.Router();

router.post("/upload", authenticateMiddleWare,upload.array("document"), uploadDocument);
router.get("/:workSpaceId",authenticateMiddleWare, getDocumentsByWorkspace);

export default router;


