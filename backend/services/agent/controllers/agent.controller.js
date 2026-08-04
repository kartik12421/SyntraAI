import axios from "axios";
import { graph } from "../graph/graph.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;
    if (!conversationId) {
      return res.status(400).json({ message: "conversation id missing" });
    }

    if (!prompt?.trim()) {
      return res.status(400).json({ message: "prompt missing" });
    }

    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-messages`, {
      conversationId,
      role: "user",
      content: prompt.trim(),
    });

    const result = await graph.invoke({
      prompt: prompt.trim(),
      conversationId,
    });

    const response = result.aiResponse;

    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-messages`, {
      conversationId,
      role: "assistant",
      content: response,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: `agent error: ${error.message}` });
  }
};
