import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to gateway" });
});

// Proxy to auth service
app.use("/auth", proxy(process.env.AUTH_SERVICE));

app.listen(port, () => {
  console.log(`gateway started at ${port}`);
});
