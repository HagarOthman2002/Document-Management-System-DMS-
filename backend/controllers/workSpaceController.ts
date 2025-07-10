import { Request, Response } from "express";
import Workspace from "../models/workSpcae.model";
import { PrismaClient } from "../generated/prisma/client";
import { validateNationalId } from "../utilities";
import { createWorkspaceService ,getWorkspacesByNIDService,updateWorkspaceService ,deleteWorkspaceService } from "../services/workspace.service";
const prisma = new PrismaClient();

export const createWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const workspace = await createWorkspaceService(req.body);
    res.status(201).json({ status: "success", workspace });
  } catch (err: any) {
    const message = err.message || "Internal server error";
    const status = err.statusCode || 500;
    res.status(status).json({ status: "error", message });
  }
};


export const getWorkspacesByNID = async (req: Request, res: Response): Promise<void> => {
  try {
    const workspaces = await getWorkspacesByNIDService(req.params.nid);
    res.json({ status: "success", workspaces });
  } catch (err: any) {
    const message = err.message || "Internal server error";
    const status = err.statusCode || 500;
    res.status(status).json({ status: "error", message });
  }
};

export const updateWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await updateWorkspaceService(req.params.id, req.body)
    res.json({ status: "success", workspace: updated });
  } catch (err: any) {
    const message = err.message === "Workspace not found"
      ? "Workspace not found"
      : "Failed to update workspace";
    res.status(500).json({ status: "error", message });
  }
  }

export const deleteWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteWorkspaceService(req.params.id);
    res.json({ status: "success", message: "Workspace deleted" });
  } catch (err: any) {
    const status = err.statusCode || 500;
    const message = err.message || "Failed to delete workspace";
    res.status(status).json({ status: "error", message });
  }
};
