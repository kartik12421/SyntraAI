import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embedding.js";
import dotenv from "dotenv";
dotenv.config();

export const vectorStore = async (docs, collectionName) => {
  return await QdrantVectorStore.fromTexts(docs, { source: "pdf" }, embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName,
  });
};
