import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { expiryTime } from "../constants";
import { validateEmail, validateNationalId } from "../utilities";


const prisma = new PrismaClient();
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  nid: string;
}

export const signUp = async ({
  name,
  email,
  password,
  nid,
}: SignUpInput) => {
  email = email.trim();
  name = name.trim();
  password = password.trim();
  nid = nid.trim();

  if (!email || !name || !password || !nid) {
    throw new Error("Missing required fields");
  }

  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!validateNationalId(nid)) {
    throw new Error("Invalid Egyptian National ID format");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nid }],
    },
  });

  if (existingUser) {
    throw new Error("A user with that email or NID already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      nid,
    },
  });

  return { message: "User registered successfully" };
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id, nid: user.nid, email: user.email }, JWT_SECRET, {
    expiresIn: expiryTime,
  });

  return { token };
};

export const getUser = async (userId: number) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, nid: true },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user
};
