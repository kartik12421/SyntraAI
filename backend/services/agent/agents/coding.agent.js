import { getModel } from "../config/llm.model.js";

const getResponseText = (content) => {
  if (typeof content === "string") return content.trim();

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("")
      .trim();
  }

  return "";
};

const parseGeneratedFiles = (content) => {
  const text = getResponseText(content);
  const blocks = [...text.matchAll(/```([\w-]*)\s*\r?\n([\s\S]*?)(?:```|$)/g)]
    .map((match) => ({ language: match[1].toLowerCase(), content: match[2].trim() }))
    .filter((block) => block.content);

  const fileDefinitions = [
    { name: "index.html", languages: ["html"] },
    { name: "style.css", languages: ["css"] },
    { name: "script.js", languages: ["javascript", "js"] },
  ];
  const files = fileDefinitions.map((file, index) => {
    const block = blocks.find((item) => file.languages.includes(item.language)) || blocks[index];
    return block ? { name: file.name, content: block.content } : null;
  }).filter(Boolean);

  if (!files.some((file) => file.name === "index.html")) {
    throw new Error("The code model did not return an HTML file. Please try again.");
  }

  return { files };
};

export const codingAgent = async (state) => {
  try {
    const intentLlm = await getModel("intent");
    const llm = await getModel("code");
    const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
        `);

    const intent = getResponseText(intentRes.content);
    let prompt;

    // for code generation
    if (intent == "CODE_GENERATION") {
      prompt = `

        You are SyntraAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

Rules:

- Return exactly three code blocks, in this order: html, css, javascript.
- Use \`\`\`html for index.html, \`\`\`css for style.css, and \`\`\`javascript for script.js.
- Do not add any text outside the code blocks.
- Keep each file concise enough to finish completely.

User Request:
${state.prompt}
        `;

      const response = await llm.invoke(prompt);
      const data = parseGeneratedFiles(response.content);

      return {
        ...state,
        aiResponse: "code generated successfully",
        artifacts: [
          {
            id: Date.now(),
            type: "project_code",
            files: data.files || [],
            title: state.prompt,
          },
        ],
      };
    } else {
      prompt = `You are CortexAI Coding Agent.

The user's coding intent is ${intent}. Provide a clear, practical answer with
valid code where useful. Use Markdown and explain any important assumptions.

User Request:
${state.prompt}`;

      const response = await llm.invoke(prompt);
      return {
        ...state,
        aiResponse: getResponseText(response.content),
        artifacts: [],
      };
    }
  } catch (error) {
    throw new Error(`coding agent failed: ${error.message}`);
  }
};
