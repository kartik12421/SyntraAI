import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import paymentRouter from "./routes/payment.route.js";

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/", paymentRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to payment" });
});

app.listen(port, () => {
  console.log(`payment service started at ${port}`);
  connectDb();
});
