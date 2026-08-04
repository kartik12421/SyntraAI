import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        maxTokens: undefined,
        maxRetries: 2,
      });
    case "search":
      return new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        maxTokens: undefined,
        maxRetries: 2,
      });
    case "code":
      return new ChatGoogleGenerativeAI({
        model: "gemini-2.5-pro",
        temperature: 0,
        maxRetries: 2,
      });
    //   case "pdf":
    //     return "pdf";
    //     break;
    //   case "ppt":
    //     return "ppt";
    //     break;
    //   case "imageGen":
    //     return "imageGen";
    //     break;

    default:
      return new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        maxTokens: undefined,
        maxRetries: 2,
      });
  }
};
