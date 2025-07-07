import express from "express";
const router = express.Router();
import {
  createWorkspace,
  getWorkspacesByNID,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workSpaceController";



router.post("/", createWorkspace);                  
router.get("/:nid", getWorkspacesByNID);       
router.put("/:id", updateWorkspace);               
router.delete("/:id", deleteWorkspace);             

export default router;
