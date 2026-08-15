import Razorpay from "razorpay";
import dotenv from "dotenv/config";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export default razorpay;
