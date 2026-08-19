import dotenv from "dotenv";
import { TavilySearch } from "@langchain/tavily";

dotenv.config();

export const searchTool = new TavilySearch({
  tavilyApiKey: process.env.TAVILY_API_KEY,
  maxResults: 5,
  topic: "general",
  searchDepth: "basic",
  includeImages: true,
  includeAnswer: true,
});
