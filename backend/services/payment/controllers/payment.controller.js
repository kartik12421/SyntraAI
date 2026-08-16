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

export const verifyPayment = async () => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const genSign = crypto
      .createHmac("sha512", process.env.RAZORPAY_API_KEY)
      .update(`${razorpay_order_id} | ${razorpay_payment_id}`)
      .digest("hex");

    if (genSign != razorpay_signature) {
      return res.status(400).json({ message: "payment verification failed" });
    }

    const payment = await Payment.findOne({ orderId: razorpay_payment_id });

    if (!payment) {
      return res.status(404).json({ message: "payment not found" });
    }

    payment.status = "paid";
    payment.paymentId = razorpay_payment_id;
    await payment.save();

    await axios.post(`${process.env.AUTH_SERVICE}/update-plan`, {
      userId: payment?.userId,
      plan: payment?.plan,
      credits: payment?.credits,
    });

    return res.status(200).json({ message: "Payment verified" });
  } catch (error) {
    return res.status(500).json({ message: `Payment verify error: ${error.message}` });
  }
};
