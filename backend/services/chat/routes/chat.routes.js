import express from "express";
import {
  createConversation,
  getConversation,
  getMessages,
  saveMessage,
  updateConversation,
} from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/create-conversation", createConversation);
chatRouter.get("/get-conversation", getConversation);
chatRouter.post("/update-conversation", updateConversation);

chatRouter.post("/save-messages", saveMessage);
chatRouter.get("/get-messages/:conversationId", getMessages);

export default chatRouter;
