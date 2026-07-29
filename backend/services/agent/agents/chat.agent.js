import { getModel } from "../config/llm.model";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");
  const sysPrompt = `You are SyntraAI, an intilligent AI assistant.`;
  const response = await llm.invoke([
    {
      role: "system",
      content: sysPrompt,
    },
    {
      role: "human",
      content: state.prompt,
    },
  ]);

  return {
    ...state,
    aiResponse: response.content,
  };
};
