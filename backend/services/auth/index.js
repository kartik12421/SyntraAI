import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

// Routes are mounted at root because the gateway already proxies the /api/auth prefix.
app.use("/", authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to auth" });
});

app.listen(port, () => {
  console.log(`auth service started at ${port}`);
  connectDb();
});
