import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";

export const pdfRag = async (state) => {
  try {
    const buffer = fs.readFileSync(state.file.path);
    const pdf = await PDFParse({
      data: buffer,
    });

    const res = pdf.getText();
    const text = res.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 500,
    });
    const docs = splitter.splitText([text]);
    const collectioNname = `pdf-${Date.now()}`;

    const store = await vectorStore(docs, collectionName);
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to analyze ppt 😓",
    };
  }
};
