import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llm.model.js";
import fs from "fs";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imgAnalyzer = async (state) => {
  try {
    await checkAgentLimit(state.userId, "image");
    const llm = await getModel("imgAnalyzer");
    const imgBuffer = await fs.promises.readFile(state.file.path);
    const base64Img = imgBuffer.toString("base64");

    const messages = [
      new SystemMessage(
        `You are SyntraAI image analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.
`,
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "analyze this image",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Img}`,
            },
          },
        ],
      }),
    ];

    const res = await llm.invoke(messages);
    return {
      ...state,
      aiResponse: res.content,
    };
  } catch (error) {
    console.error("imgAnalyzer error:", error.message);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to analyze file 😓",
    };
  } finally {
    if (state.file?.path) {
      fs.promises.unlink(state.file.path).catch(() => {});
    }
  }
};
