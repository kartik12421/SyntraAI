import express from "express";
import { login, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/logout", logOut);

export default authRouter;
