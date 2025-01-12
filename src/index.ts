import express, { Response } from "express";
import authRoutes from "./routes/authRoutes";
import initPassport from "./config/passport";
import session from "express-session";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const port = 8084;
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Utiliser des cookies sécurisés en production
    },
  }),
);

initPassport(app);

app.use(authRoutes);
app.use("/api", userRoutes);

app.get("/", (_, res: Response) => {
  res.send("yo man");
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
