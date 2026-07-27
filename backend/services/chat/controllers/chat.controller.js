import Conversation from "../models/convserstion.model.js";
import Message from "../models/message.model";

//conversations
export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(userId);
    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `create conversation failed: ${error.message}` });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(userId);
    const conversation = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get conversation failed: ${error.message}` });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(id, {
      title,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `update conversation failed: ${error.message}` });
  }
};

//messages
export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    const message = await Message.create({
      conversationId,
      content,
      role,
    });

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `save messages failed: ${error.message}` });
  }
};

export const getmessages = async (req, res) => {
  try {
    const message = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get messages failed: ${error.message}` });
  }
};
