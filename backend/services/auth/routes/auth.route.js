import express from "express";
import {
  login,
  logOut,
  updateUserPayment,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/", login);
authRouter.post("/login", login);
authRouter.get("/logout", logOut);
authRouter.post("/update-plan", updateUserPayment);

export default authRouter;
