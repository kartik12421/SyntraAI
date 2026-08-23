import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessages } from "../config/memory.js";
import { burnCredits } from "../utils/burnCredits.js";

export const agent = async (req, res, next) => {
  try {
    const { prompt, conversationId, agent: selectedAgent } = req.body;
    const file = req.file;

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
      agent: selectedAgent,
      file
    });

    const userId = req.headers["x-user-id"];
    await burnCredits(
      userId,
      result.agent || selectedAgent,
      req.headers.cookie,
    );

    await addMessages(conversationId, "user", prompt.trim());

    await addMessages(conversationId, "assistant", result.aiResponse);

    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-messages`, {
      conversationId,
      role: "assistant",
      content: result?.aiResponse,
      images: result?.images,
      artifacts: result?.artifacts,
    });

    return res.status(200).json({
      answer: result?.aiResponse,
      images: result?.images,
      artifacts: result?.artifacts,
    });
  } catch (error) {
    next(error)
  }
};
