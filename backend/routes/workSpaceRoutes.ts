import express from "express";
import { authenticateMiddleWare } from "../utilities";
const router = express.Router();
import {
  createWorkspace,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workSpaceController";



router.post("/",authenticateMiddleWare ,createWorkspace);                  
router.get("/",authenticateMiddleWare ,getWorkspaces);       
router.put("/:id",authenticateMiddleWare ,updateWorkspace);               
router.delete("/:id", authenticateMiddleWare,deleteWorkspace);             

export default router;
