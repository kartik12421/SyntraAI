import express from "express";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to gateway" });
});

app.listen(port, () => {
  console.log(`gateway started at ${port}`);
});
