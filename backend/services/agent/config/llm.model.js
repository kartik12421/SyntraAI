import { ChatGroq } from "@langchain/groq";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const codeModel = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0.2,
  maxTokens: 8192,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  maxOutputTokens: 8192,
});

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return groq;
    case "search":
      return groq;
    case "code":
      return codeModel;
    case "imgAnalyzer":
      return gemini;
    case "pdfRag":
      return groq;
    default:
      return groq;
  }
};
