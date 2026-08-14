import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to payment" });
});

app.listen(port, () => {
  console.log(`payment service started at ${port}`);
  connectDb();
});
