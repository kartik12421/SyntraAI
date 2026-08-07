import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import chatRouter from "./routes/chat.routes.js";

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/", chatRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to chat" });
});

app.listen(port, () => {
  console.log(`auth service started at ${port}`);
  connectDb();
});
