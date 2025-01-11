import { user } from "@prisma/client";
import { Router } from "express";
import passport from "passport";

const authRoutes = Router();

authRoutes.get("/auth/discord", passport.authenticate("discord"));

authRoutes.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/", session: false }),
  (req, res) => {
    console.log(req.user);
    res.json({
      token: (req.user as any).token,
      user: (req.user as any).user as user,
    });
  },
);

export default authRoutes;
