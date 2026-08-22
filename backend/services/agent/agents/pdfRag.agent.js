import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llm.model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { burnCredits } from "../utils/burnCredits.js";

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

    const releventDocs = await store.similaritySearch(state.prompt, 5);

    const context = releventDocs.map((d) => d.pageContent).join("/n/n");

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

    const response = llm.invoke(messages);
    await burnCredits(state.userId, "pdf");
    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to analyze PDF 😓",
    };
  } finally {
    fs.unlink(state.file.path);
  }
};
