import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import prisma from "../db/client";

const userRoutes = Router();

// get User from jwt
userRoutes.get(
  "/user/jwt",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(404).json({ error: "could not find user in Request" });
      }

      console.log("req ", req.user);

      const userId = (req.user as any).userId;

      if (!userId) {
        res.status(404).json({ error: "could not find this user" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      console.log(user);

      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: "an error occured" });
    }
  },
);

userRoutes.get("/users", verifyToken, async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json("Something went wrong");
    }
  }
});

userRoutes.get("/user", verifyToken, async (req: Request, res: Response) => {
  try {
    let id = req.body.id;
    if (!id) {
      res
        .status(400)
        .json({ error: "bad request, id is required to fetch a user" });
    }

    if (typeof id === "string") {
      parseInt(id);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    res.json({ user });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json("Something went wrong");
    }
  }
});

export default userRoutes;
