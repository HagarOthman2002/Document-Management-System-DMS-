import { Request, Response } from "express";

import * as workspaceServices from "../services/workspace.service";

import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const createWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workspace = await workspaceServices.createWorkspace(req.body);
    res.status(201).json({ status: "success", workspace });
  } catch (err: any) {
    const message = err.message || "Internal server error";
    const status = err.statusCode || 500;
    res.status(status).json({ status: "error", message });
  }
};

export const getWorkspaces = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;
    const nid = user?.nid;

    if (!nid) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: NID not found" });
      return;
    }

    const workspaces = await workspaceServices.getWorkspaces(nid);
    res.status(200).json({ status: "success", workspaces });
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
    const updated = await workspaceServices.updateWorkspace(
      req.params.id,
      req.body
    );
    res.json({ status: "success", workspace: updated });
  } catch (err: any) {
    const message =
      err.message === "Workspace not found"
        ? "Workspace not found"
        : "Failed to update workspace";
    res.status(500).json({ status: "error", message });
  }
};

export const deleteWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await workspaceServices.deleteWorkspace(req.params.id);
    res.json({ status: "success", message: "Workspace deleted" });
  } catch (err: any) {
    const status = err.statusCode || 500;
    const message = err.message || "Failed to delete workspace";
    res.status(status).json({ status: "error", message });
  }
};
