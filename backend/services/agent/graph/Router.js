import { getModel } from "../config/llm.model.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  const llm = await getModel("router");
  const prompt = `You are an agent router.

  Available agents:

  - chat
  - search
  - code

  Rules: 

  chat: 
  General conversation, 
  explainations, 
  learning, 
  questions.

  search: 
  Current eventsm, 
  latest information, 
  news, 
  current time, 
  recent developments, 
  internet lookup.

  code: 
  Generate code, 
  debug code, 
  build projects, 
  architecture, 
  API design.


  return ONLY one word: 

  chat
  search
  code


  User Query: 
    ${state.prompt}
  
  `;

  const response = await llm.invoke(prompt);
  const routedAgentText = response.content.trim().toLowerCase();
  const routedAgent =
    routedAgentText.match(/\b(chat|search|code)\b/)?.[1] || "chat";

  return {
    ...state,
    agent: routedAgent,
  };
};
