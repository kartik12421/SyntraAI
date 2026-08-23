import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import agentRouter from "./routes/agent.route.js";

const port = process.env.PORT;

const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/", agentRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to agent" });
});

//error middleware
app.use((err, req, res, next) => {
  console.log(err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({ message: `agent error: ${error}` });
});

app.listen(port, () => {
  console.log(`agent service started at ${port}`);
  connectDb();
});
