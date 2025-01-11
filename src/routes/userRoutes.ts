import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import prisma from "../db/client";

const userRoutes = Router();

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
