import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify-order", verifyPayment);

export default paymentRouter;
