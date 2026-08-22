import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./Router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imgAnalyzer } from "../agents/imgAnalyzer.agent.js";

const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("code", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("imageGen", imageGenAgent);
workflow.addNode("pdfRag", pdfRag);
workflow.addNode("imgAnalyzer", imgAnalyzer);

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
        break;
      case "search":
        return "search";
        break;
      case "code":
        return "code";
        break;
      case "pdf":
        return "pdf";
        break;
      case "ppt":
        return "ppt";
        break;
      case "imageGen":
        return "imageGen";
        break;
      case "pdfRag":
        return "pdfRag";
        break;
      case "imgAnalyzer":
        return "imgAnalyzer";
        break;

      default:
        return "chat";
        break;
    }
  },
  {
    chat: "chat",
    search: "search",
    code: "code",
    pdf: "pdf",
    ppt: "ppt",
    imageGen: "imageGen",
    pdfRag: "pdfRag",
    imgAnalyzer: "imgAnalyzer",
  },
);

workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("code", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("imageGen", "__end__");
workflow.addEdge("pdfRag", "__end__");
workflow.addEdge("imgAnalyzer", "__end__");

export const graph = workflow.compile();
