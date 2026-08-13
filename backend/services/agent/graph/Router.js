import { getModel } from "../config/llm.model.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  const llm = await getModel("router");
  const prompt = `You are an agent router. Analyze the user query and choose the single most appropriate agent.

  Available agents:

  - chat
  - search
  - code
  - pdf
  - ppt
  - imageGen

  Rules: 

  chat: 
  General conversation, 
  explanations, 
  learning, 
  questions, 
  advice.

  search: 
  Current events, 
  latest information, 
  news, 
  current time, 
  recent developments, 
  internet lookup, 
  anything that needs live/web data.

  code: 
  Generate code, 
  debug code, 
  build projects, 
  architecture, 
  API design, 
  build an app/website,
  explain code.

  pdf: 
  Generate or create a PDF document, 
  summaries, 
  reports, 
  resumes, 
  essays, 
  formal documents that should be a downloadable PDF.

  ppt: 
  Generate or create a PPT or presentation, 
  slides, 
  slide deck.

  imageGen: 
  Generate or create an image, 
  picture, 
  photo, 
  logo, 
  drawing, 
  illustration.

  IMPORTANT: If the user asks to create/build/make ANY visual artifact (PDF, PPT, image), route to the matching agent instead of chat or code.

  Return ONLY one word:

  chat
  search
  code
  pdf
  ppt
  imageGen


  User Query: 
    ${state.prompt}
  
  `;

  const response = await llm.invoke(prompt);
  const routedAgentText = response.content.trim().toLowerCase();
  const routedAgent =
    routedAgentText.match(/\b(chat|search|code|pdf|ppt|imagegen)\b/)?.[1] ||
    "chat";

  return {
    ...state,
    agent: routedAgent === "imagegen" ? "imageGen" : routedAgent,
  };
};
