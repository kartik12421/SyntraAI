import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import agentRouter from "./routes/agent.route.js";
dotenv.config();

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/", agentRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to agent" });
});

app.listen(port, () => {
  console.log(`agent service started at ${port}`);
  connectDb();
});
