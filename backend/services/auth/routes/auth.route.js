import express from "express";
import {
  burnCredits,
  login,
  logOut,
  updateUserPayment,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/", login);
authRouter.post("/login", login);
authRouter.get("/logout", logOut);
authRouter.post("/update-plan", updateUserPayment);
authRouter.post("/burn-credits", burnCredits);

export default authRouter;
