import { Router } from "express";
import passport from "passport";

const authRoutes = Router();

authRoutes.get("/auth/discord", passport.authenticate("discord"));

authRoutes.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/", session: false }),
  (req, res) => {
    // Retourne le token JWT
    res.json({ token: (req.user as any).token });
  },
);

export default authRoutes;
