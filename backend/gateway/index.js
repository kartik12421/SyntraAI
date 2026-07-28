import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import protectRoute from "./middleware/auth.middleware.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
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

// Proxy to auth service
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protectRoute, proxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/me", protectRoute, getCurrentUser);
app.use("/api/agent", protectRoute, proxy(process.env.AGENT_SERVICE));

//routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to gateway" });
});
app.listen(port, () => {
  console.log(`gateway started at ${port}`);
});
