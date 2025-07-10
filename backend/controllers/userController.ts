import { Request, Response } from "express";

import * as authServices from "../services/authServices";


interface JwtPayload {
  userId: number;
}
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, nid } = req.body;

    const result = await authServices.signUp({ name, email, password, nid });

    res.status(201).json({ status: "success", message: result.message });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const { token } = await authServices.login(email, password);
    res.json({ status: "success", token });
  } catch (err: any) {
    const message = err.message || "Server error";
    const statusCode = message === "Invalid credentials" ? 401 : 400;
    res.status(statusCode).json({ status: "error", message });
  }
};



export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  try {
    const foundUser = await authServices.getUser(userId);

    if (!foundUser) {
      res.sendStatus(401);
      return;
    }

    res.json({ user: foundUser, message: "success" });
  } catch (err: any) {
    const message =
      err.message === "User not found" || err.message === "Unauthorized"
        ? err.message
        : "Server error";
    const statusCode = err.message === "User not found" ? 404 : 401;
    res.status(statusCode).json({ status: "error", message });
  }
};

