import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llm.model.js";
import { getMemory } from "../config/memory.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const chatAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "chat");
    const llm = await getModel("chat");

    const history = await getMemory(state.conversationId);

    const searchAnswerText =
      typeof state.searchAnswer === "string" && state.searchAnswer.trim()
        ? state.searchAnswer.trim()
        : "";

    const searchResultsText =
      state.searchResults && state.searchResults.length
        ? state.searchResults
            .slice(0, 5)
            .map(
              (result, index) =>
                `Result ${index + 1}: ${result.title || result.url || "No title"}\n${result.url || ""}\n${result.content || ""}`,
            )
            .join("\n\n---\n\n")
        : "";

    const imageContext =
      state.images && state.images.length
        ? `\nRelated images:\n${state.images.join("\n")}`
        : "";

    const searchContext =
      searchAnswerText || searchResultsText
        ? `\nWEB Search Results:\n${
            searchAnswerText ? `\nSearch answer: ${searchAnswerText}\n` : ""
          }${searchResultsText ? `\n${searchResultsText}\n` : ""}\nAnswer the user using only the above search results and related images if relevant. Do not say you cannot access real-time data when the results clearly provide current information.${imageContext}\n\n`
        : ``;

    const sysPrompt = `You are SyntraAI, an intelligent AI assistant.

If searchContext exists:
- Use search results to answer directly.
- Use the exact information from the results.
- Do not mention internal tools or say you cannot access the internet.
- For current time, live information, or breaking news, answer from the search results.

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
    const messages = [new SystemMessage(sysPrompt)];

    if (searchContext) {
      messages.push(new SystemMessage(searchContext));
    }

    history.forEach((msg) => {
      if (msg.role == "user") {
        messages.push(new HumanMessage(msg.content));
      } else {
        messages.push(new AIMessage(msg.content));
      }
    });

    messages.push(new HumanMessage(state.prompt));

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Chat agent failed 😓.",
    };
  }
};
