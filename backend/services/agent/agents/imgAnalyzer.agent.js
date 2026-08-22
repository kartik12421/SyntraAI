import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llm.model.js";
import fs from "fs";
import { burnCredits } from "../utils/burnCredits.js";

export const imgAnalyzer = async (state) => {
  try {
    const llm = await getModel("imtext.file.pathgAnalyzer");
    const imgBuffer = await fs.readFile(text.file.path);
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
    await burnCredits(state.userId, "imageGen");
    return {
      ...state,
      aiResponse: res.content,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to analyze file 😓",
    };
  } finally {
    fs.unlink(state.file.path);
  }
};
