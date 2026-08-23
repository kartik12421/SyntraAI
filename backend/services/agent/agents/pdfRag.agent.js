import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llm.model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRag = async (state) => {
  let parser;
  try {
    await checkAgentLimit(state.userId, "pdfRag");
    const buffer = fs.readFileSync(state.file.path);
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 500,
    });
    const docs = await splitter.splitText(text);
    const collectionName = `pdf-${Date.now()}`;
    const store = await vectorStore(docs, collectionName);

    const releventDocs = await store.similaritySearch(state.prompt, 5);

    const context = releventDocs.map((d) => d.pageContent).join("\n\n");

    const llm = await getModel("pdfRag");

    const messages = [
      new SystemMessage(`You are SyntraAI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),
      new HumanMessage(`
            Context: ${context} 
            Question: ${state.prompt}
            `),
    ];

    const response = await llm.invoke(messages);
    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    if (error.status == 429) {
      return {
        ...state,
        aiResponse: error?.data?.message,
      };
    }
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to analyze PDF 😓",
    };
  } finally {
    await parser?.destroy();
    if (state.file?.path) {
      fs.promises.unlink(state.file.path).catch(() => {});
    }
  }
};
