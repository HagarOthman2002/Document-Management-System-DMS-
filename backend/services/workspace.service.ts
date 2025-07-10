import { PrismaClient } from "../generated/prisma/client";
import {validateNationalId} from "../utilities"
import Workspace from "../models/workSpcae.model";
const prisma = new PrismaClient();


export const createWorkspace = async (data: {
  name: string;
  nid: string;
  description?: string;
}) => {
  const { name, nid, description } = data;

  if (!name || !nid || !validateNationalId(nid)) {
    const error = new Error("Invalid input data");
    (error as any).statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { nid } });
  if (!user) {
    const error = new Error("User not found with this NID");
    (error as any).statusCode = 404;
    throw error;
  }

  const workspace = await Workspace.create({ name, nid, description });
  return workspace;
};

export const getWorkspacesByNID = async (nid: string) => {
  if (!nid || !validateNationalId(nid)) {
    const error = new Error("Invalid NID");
    (error as any).statusCode = 400;
    throw error;
  }

  const workspaces = await Workspace.find({ nid });

  return workspaces;
};

export const updateWorkspace = async (id: string, data: any) => {
  if (!id) {
    const error = new Error("Invalid workspace ID");
    (error as any).statusCode = 400;
    throw error;
  }

  const updated = await Workspace.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updated) throw new Error("workSpace not found");
  return updated;
};

export const deleteWorkspace = async (id: string) => {
  if (!id) {
    const error = new Error("Invalid workspace ID");
    (error as any).statusCode = 400;
    throw error;
  }

  const deleted = await Workspace.findByIdAndDelete(id);
  if (!deleted) {
    const error = new Error("Workspace not found");
    (error as any).statusCode = 404;
    throw error;
  }

  return deleted;
};

