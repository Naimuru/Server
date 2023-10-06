import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { DecodeToken } from "../types/user";
import { secret } from "../config/secret";

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, secret) as DecodeToken;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ error: "User not found" });
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

export default verifyToken;
