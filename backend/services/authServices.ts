import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {expiryTime} from "../constants"



const prisma = new PrismaClient();
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const findExistingUser = async (email: string, nid: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nid }],
    },
  });
};

export const createUser = async(name : string, email :string, password: string, nid:string) => {
    const hashedPassword = await bcrypt.hash(password , 10)
    return await prisma.user.create({
    data: { name, email, password: hashedPassword, nid },
  });
};

export const findUserByEmail = async (email:string) => {
    return await prisma.user.findUnique({
      where: { email },
    });}

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: expiryTime });
};

export const findUserById = async (userId : number) =>{
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, nid: true },
    });
}