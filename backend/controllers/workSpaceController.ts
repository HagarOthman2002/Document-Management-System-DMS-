import { Request, Response } from "express";
import Workspace from "../models/workSpcae.model";
import { PrismaClient } from "../generated/prisma/client"; 
const prisma = new PrismaClient();

export const createWorkspace = async (req: Request, res: Response): Promise<void>  => {
  const { name, nid, description } = req.body;


  if (!name || !nid || nid.length !== 14) {
     res.status(400).json({ status: "error", message: "Invalid input data" });
     return
  }

  try {
  
    const user = await prisma.user.findUnique({ where: { nid } });
    if (!user) {
       res.status(404).json({ status: "error", message: "User not found with this NID" });
       return
    }

 
    const workspace = await Workspace.create({ name, nid, description });
    res.status(201).json({ status: "success", workspace });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Failed to create workspace" });
  }
};

export const getWorkspacesByNID = async (req: Request, res: Response) : Promise<void> => {
  const { nid } = req.params;

  if (!nid || nid.length !== 14) {
     res.status(400).json({ status: "error", message: "Invalid NID" });
     return
  }

  try {
    const workspaces = await Workspace.find({ nid });
    res.json({ status: "success", workspaces });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Failed to fetch workspaces" });
  }
};

export const updateWorkspace = async (req: Request, res: Response) : Promise<void> =>{
  try {
    const updated = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
       res.status(404).json({ status: "error", message: "Workspace not found" });
       return
    }
    res.json({ status: "success", workspace: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Failed to update workspace" });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) : Promise<void> => {
  try {
    const deleted = await Workspace.findByIdAndDelete(req.params.id);
    if (!deleted) {
       res.status(404).json({ status: "error", message: "Workspace not found" });
       return
    }
    res.json({ status: "success", message: "Workspace deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Failed to delete workspace" });
  }
};
