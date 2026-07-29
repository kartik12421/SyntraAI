import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  maxRetries: 2,
});

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
});

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return groq;
      break;
    case "search":
      return groq;
      break;
    case "code":
      return gemini;
      break;
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
      return groq;
      break;
  }
};
