import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const paymentrouter = express.Router();

paymentrouter.post("/create-order", createOrder);
paymentrouter.post("/verify-order", verifyPayment);

export default paymentrouter;
