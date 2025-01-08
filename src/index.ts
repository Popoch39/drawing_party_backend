import express, { Response } from "express";

const app = express();
const port = 3000;
app.use(express.json());
app.get("/", (_, res: Response) => {
  res.send("yo man");
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
