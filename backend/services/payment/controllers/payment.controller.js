import { PLAN } from "../config/plans.js";
import razorpay from "../config/razorPay.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (params) => {
  try {
    const { plan } = req.body;
    const userId = req.headers["x-user-id"];
    const selectedPlan = PLAN[plan];

    if (!selectedPlan) {
      return res.status(404).json({ message: "plan not found" });
    }

    const order = razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.plan,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created",
    });

    return res.status(200).json({ order, plan: selectedPlan });
  } catch (error) {
    return res.status(500).json({ message: `payment error: ${error.message}` });
  }
};
