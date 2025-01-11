import { user } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      //@ts-ignore**
      req.id = (decoded as user).id;
      next();
    },
  );
}
