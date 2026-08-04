import { getModel } from "../config/llm.model.js";

export const router = async (state) => {
  const llm = await getModel("router");
  const prompt = `You are an agent router.

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
  explainations, 
  learning, 
  questions.

  search: 
  Current eventsm, 
  latest information, 
  news, 
  recent developments, 
  internet lookup.

  code: 
  Generate code, 
  debug code, 
  build projects, 
  architecture, 
  API design.

  ppt:
  Questions about generate ppts
  or ppt context.

  pdf: 
  Questions about generate PDFs
  or document context.

  imageGen: 
  Generate image, 
  create image.


  return ONLY one word: 

  chat
  search
  code
  ppt
  pdf
  imageGen


  User Query: 
    ${state.prompt}
  
  `;

  const response = await llm.invoke(prompt);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
