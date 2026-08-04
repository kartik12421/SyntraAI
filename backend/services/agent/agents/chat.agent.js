import { getModel } from "../config/llm.model.js";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");
  const sysPrompt = `You are SyntraAI, an intilligent AI assistant.

  Rules:
- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.


  Formatting:
- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.

  
  `;
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
