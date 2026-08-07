import Conversation from "../models/convserstion.model.js";
import Message from "../models/message.model.js";

//conversations
export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ message: "user id missing" });
    }

    const conversation = await Conversation.create({
      userId,
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
    if (!userId) {
      return res.status(400).json({ message: "user id missing" });
    }

    const conversation = await Conversation.find({
      userId,
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
    const { conversationId, role, content, images, artifacts } = req.body;
    if (!conversationId) {
      return res.status(400).json({ message: "conversation id missing" });
    }

    if (!content?.trim()) {
      return res.status(400).json({ message: "message content missing" });
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({ message: "invalid message role" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "conversation not found" });
    }

    const message = await Message.create({
      conversationId,
      content: content.trim(),
      role,
      images,
      artifacts,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `save messages failed: ${error.message}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const message = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get messages failed: ${error.message}` });
  }
};
