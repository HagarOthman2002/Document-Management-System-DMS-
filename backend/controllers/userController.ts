import { validateEmail ,validateNationalId } from "../utilities";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {findExistingUser ,createUser ,findUserByEmail,findUserById,generateToken} from "../services/authServices"


interface JwtPayload {
  userId: number;
}
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}




export const register = async (req: Request, res: Response): Promise<void> => {
  let { email, name, password, nid } = req.body;

  email = email?.trim();
  name = name?.trim();
  password = password?.trim();
  nid = nid?.trim();

  if (!email || !name || !password || !nid) {
    res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ status: "error", message: "Invalid email format" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters",
    });
    return;
  }
  
  console.log("NID before validation:", nid);
console.log("NID is valid:", validateNationalId(nid));
  if ( !validateNationalId(nid)) {
    res
      .status(400)
      .json({ status: "error", message: "Invalid Egyptian National ID format" });
    return;
  }

  try {
    const existingUser = await findExistingUser(email, nid);
    if (existingUser) {
      res.status(409).json({
        status: "error",
        message: "A user with that email or NID already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser( name , email , password , nid)

    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ status: "error", message: "Email and password required" });
    return;
  }

  try {
    const user = await findUserByEmail(email)

    if (!user) {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
      return;
    }

    const token =  generateToken(user.id)

    res.json({ status: "success", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userPayload = req.user;

  if (!userPayload || !userPayload.userId) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  try {
    const foundUser = await findUserById(userPayload.userId)

    if (!foundUser) {
      res.sendStatus(401);
      return;
    }

    res.json({ user: foundUser, message: "" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
