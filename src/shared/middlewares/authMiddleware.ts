import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import SessionModel from "../../modules/auth/models/sessionModel";
import { User } from "../../modules/users/usersTypes";

interface JwtPayload {
  user: User;
  role: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token not provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if session exists in database
    const session = await SessionModel.findOne({ where: { token } });

    if (!session) {
      res.status(401).json({ message: "Invalid or expired session" });
      return;
    }

    // Verify that the session belongs to the user in the token
    if (session.userId !== decoded.user.id) {
      res.status(401).json({ message: "Session does not belong to user" });
      return;
    }

    // Attach user info to request for use in controllers
    (req as any).userId = decoded.user.id;
    (req as any).role = decoded.role;
    (req as any).token = token;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
