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
    res.redirect(
      `${process.env.FRONT_URL}/login?token=${(req.user as any).token}`,
    );
  },
);

export default authRoutes;
