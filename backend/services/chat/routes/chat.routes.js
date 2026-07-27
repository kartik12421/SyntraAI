import express from "express";
import {
  createConversation,
  getConversation,
  getmessages,
  saveMessage,
  updateConversation,
} from "../controllers/chat.controller";

const chatRouter = express.Router();

chatRouter.get("/create-conversation", createConversation);
chatRouter.get("/get-conversation", getConversation);
chatRouter.post("/update-conversation", updateConversation);

chatRouter.post("/save-messages", saveMessage);
chatRouter.get("/get-messages/:conversationId", getmessages);

export default chatRouter;
