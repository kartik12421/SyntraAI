import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());

//routes
app.use(authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to auth" });
});

app.listen(port, () => {
  console.log(`auth service started at ${port}`);
  connectDb();
});
