import passport from "passport";
import Strategy from "passport-discord";
import prisma from "../db/client";
import jwt from "jsonwebtoken";
import { user } from "@prisma/client";
import { Express } from "express";

const initPassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    "discord",
    new Strategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_SECRET!,
        callbackURL: process.env.CALLBACK_URL!,
        scope: ["identify", "email"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: { user: user; token: string }) => void,
      ) => {
        try {
          let user = await prisma.user.findUnique({
            where: { discordId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                discordId: profile.id,
                username: profile.username,
                email: profile.email,
                avatar: profile.avatar,
              },
            });
          }

          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "2d",
          });
          return done(null, { user, token });
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new Error("User not found");
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
export default initPassport;
